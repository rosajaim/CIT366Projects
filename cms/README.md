# WeLearn CMS

An Angular 21 application and Express 5 API on Node.js 24 LTS. One administrator can manage contacts, documents and messages. Every data endpoint requires sign-in; sessions are stored in MongoDB. The frontend and API share an origin (`/api`) so a deployed browser never calls its own localhost.

## Local development

Install Node 24 (`nvm install && nvm use`), run `npm ci`, and start MongoDB 7 or 8. Use a separate development database; do not point tests at production.

Generate a password hash with `npm run password:hash` (input is hidden; minimum 12 characters). Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `MONGODB_URI` and `SESSION_SECRET` in your shell or a private `.env` file. Never commit credentials. Node 24 can load a local file with `node --env-file=.env server.js`; the app does not automatically read `.env`.

For development, use `NODE_ENV=development` and `APP_ORIGIN=http://localhost:4200`. Run `npm start` for the API and `npm run dev` in another terminal. The Angular development server proxies `/api` to port 3000. Sign in with the administrator credentials you configured.

For the built application, run `npm run build`, set `APP_ORIGIN=http://localhost:3000` with `NODE_ENV=development`, and run `npm start`. Development cookies work over HTTP; production requires HTTPS.

## Verification

- `npm run build`: optimized production bundle.
- `npm test`: component templates and HTTP behavior through Angular's Vitest runner.
- `npm run test:api`: authentication, CSRF/origin checks, input validation, references, CRUD, concurrent IDs and session reuse across app instances against real MongoDB.
- `npm run test:e2e`: real Chromium sign-in, document/contact/message workflows, deep-link reload and logout against the built bundle and real database.
- `npm audit` and `npm audit --omit=dev`: dependency advisories.

API and browser integration tests require MongoDB at `mongodb://127.0.0.1:27018` or `TEST_MONGODB_URI`. They create randomly named `cms_test_*`/`cms_smoke_*` databases and drop only those databases at completion. Set `CHROME_BIN` to your Chromium/Chrome executable for browser smoke tests (defaults to `/usr/bin/chromium`). Unit tests run in jsdom and need no browser. Run the build before the browser smoke test.

A GitHub Actions workflow runs these checks on changes to the CMS. The browser checks use disposable test credentials; no production secrets are needed by CI.

## Production deployment

1. Provision a persistent MongoDB 7/8 database with authentication, TLS and backups. Restrict network access to the application host. Use the provider's connection URI in `MONGODB_URI`; never put it in source files or frontend settings. Existing contact/document/message collections are preserved. Startup creates unique `id` indexes and initializes atomic counters from existing IDs; duplicate legacy IDs cause startup to fail and must be reconciled before deployment.
2. Review `.env.example` and enter actual values through your host's secure settings. Required: `NODE_ENV=production`, `APP_ORIGIN` (exact public HTTPS origin, no trailing slash), `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and a random `SESSION_SECRET` of at least 32 characters. Set `PORT` if the host supplies it. Only configure `TRUST_PROXY_HOPS` to the actual trusted proxy count; the default is zero. A changed password hash affects future logins; revoke existing sessions in MongoDB when rotating compromised administrator credentials. Rotating `SESSION_SECRET` revokes all sessions.
3. Build with `npm ci && npm run build`; start with `npm start`. Alternatively build `docker build -t welearn-cms .` and run behind an HTTPS reverse proxy with the required runtime settings. The Docker image runs as a non-root user and excludes development dependencies. The host must terminate HTTPS and forward requests to port 3000. Ensure the proxy strips untrusted forwarded headers and passes the original HTTPS protocol. MongoDB stores application data and sessions; container-local storage is not a database backup.
4. Verify `/healthz` returns HTTP 200, unauthenticated `/api/contacts` returns 401, sign-in succeeds, and create/edit/delete workflows work over the real public HTTPS origin. Production cookies are Secure, HttpOnly and SameSite=Strict. Mutations additionally require a session CSRF token and matching Origin. Sign-in is rate limited; the current limiter is per process, so deploy one application instance initially. Shared rate limiting is required before scaling horizontally.
5. Enable database backups with retention and test restoration. Configure host monitoring for health checks, restart events and failed requests. Keep runtime dependencies and the Node image updated. A passing local suite does not verify your host's TLS, database backups, proxy configuration or secure settings.

The app is configured for one trusted administrator, not public registration or multiple roles. Authentication failures use generic messages. URLs accept only HTTP/HTTPS, request sizes are limited, data inputs are validated, and production responses include Helmet security headers. Passwords use salted, versioned scrypt hashes (N=32768, r=8, p=3); no plaintext administrator password is stored.

## Scope

The sibling `AllEventsTicketing` project is not part of this deployment. The old Protractor test scaffolding has been replaced by the browser smoke test. Do not deploy the whole repository as static files; the CMS needs its API, persistent MongoDB and runtime credentials.

## Render staging preview

Follow [RENDER.md](RENDER.md) to create Render and MongoDB Atlas accounts and launch the root `render.yaml` Blueprint from `production-readiness`. When `APP_ORIGIN` is unset, the app uses Render's `RENDER_EXTERNAL_URL`. For custom domains, an explicit `APP_ORIGIN` overrides it. The password-hash helper can run without installing application dependencies.
