# Create a Render staging preview

This creates an online preview with administrator sign-in. The URL is publicly reachable, but all CMS data requires authentication. Use a separate database with test data. This is separate from publishing the Codex development environment.

## 1. Create accounts

- [Render](https://dashboard.render.com/register): sign up with GitHub to connect `rosajaim/CIT366Projects`.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register): create an account and a project for the CMS preview.

Use free staging options if available and review each selected plan before confirming. Render free services sleep when idle, so the first visit can be slow. Arrange backups and suitable service tiers before production.

## 2. Prepare an Atlas test database

Create a cluster, choosing the free tier if offered. Under Database Access, create a database user with read/write access limited to `cms_preview`. Save its generated password in your password manager; this is separate from the CMS administrator password.

Choose **Connect → Drivers → Node.js** and copy the connection string. Supply the database user and URL-encoded password, and put `/cms_preview` before the query string. Enter the completed URI only into Render's `MONGODB_URI` secret setting. Never paste it into chat or commit it.

Atlas also requires network access rules. After the Render service exists, find its outbound IP information and add the listed addresses/CIDR ranges to Atlas Network Access. Avoid opening the database to every Internet address. If the initial deployment reports a database connection failure, finish this allowlist step and redeploy.

## 3. Generate the administrator password hash

On your Mac, install [Node.js 24 LTS](https://nodejs.org/en/download) if `node --version` does not work. In VS Code, open `CIT366Projects`, switch to branch `production-readiness`, and pull the latest changes.

From the repository folder, run:

```bash
node cms/scripts/hash-password.js
```

Type a strong administrator password of at least 12 characters; input is hidden. Store the password in your password manager. Copy the complete printed `scrypt-v1$...` hash into Render's `ADMIN_PASSWORD_HASH` field without surrounding quotes. Do not enter the plaintext password into that field. This helper uses only Node's built-in modules; you do not need MongoDB or `npm install` on your Mac to generate the hash.

## 4. Create the Render service

In the [Render dashboard](https://dashboard.render.com/), select **New → Blueprint**, connect GitHub, and choose `rosajaim/CIT366Projects`, branch `production-readiness`. Render reads the root `render.yaml`.

Review the service and plan before applying. Enter these values securely:

| Setting | Value |
| --- | --- |
| `MONGODB_URI` | Atlas connection string using database `cms_preview` |
| `ADMIN_PASSWORD_HASH` | Complete generated password hash |
| `ADMIN_USERNAME` | Defaults to `admin`; you may change it |

The Blueprint sets production mode, Docker paths, the health check and trusted-proxy count, and generates `SESSION_SECRET`. Render supplies the public HTTPS URL and port. No manual `APP_ORIGIN` is needed for the initial `.onrender.com` URL. Automatic deployments are off so later commits do not immediately change the preview.

If using **New → Web Service** instead, choose the same repository and branch, Docker runtime, Root Directory `cms`, Dockerfile Path `./Dockerfile`, Docker Build Context `.`, and Health Check Path `/healthz`. Set `NODE_ENV=production`, `TRUST_PROXY_HOPS=1`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `MONGODB_URI`, and a securely generated `SESSION_SECRET` of at least 32 characters. The Blueprint fills most of these settings for you.

## 5. Open and validate

When deployment is live and Atlas networking is configured, open the HTTPS URL on the Render service page. Sign in with `admin` (or your chosen username) and the plaintext password you saved. Create, edit and delete test contacts, documents and messages; reload a detail page and sign out. An incognito browser should show the sign-in page.

Check `/healthz` for readiness and confirm `/api/contacts` returns 401 without sign-in. If cookies are not retained, check the proxy/HTTPS settings. If writes return 403, check that you opened the exact Render URL. For a custom domain later, set `APP_ORIGIN` to its exact HTTPS origin without a trailing slash and redeploy.

Send only the public preview URL or sanitized error text for help. Never send database URIs, password hashes or session secrets in chat. The configuration is prepared in the repository; the actual Render service must be created through your dashboard because this chat has no Render account connection.
