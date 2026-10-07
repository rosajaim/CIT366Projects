FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=build_proxy --mount=type=secret,id=build_ca \
    set -e; if [ -f /run/secrets/build_proxy ]; then export HTTPS_PROXY="$(cat /run/secrets/build_proxy)" HTTP_PROXY="$(cat /run/secrets/build_proxy)"; fi; \
    if [ -f /run/secrets/build_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/build_ca; fi; \
    npm ci
COPY angular.json tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --chown=node:node package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=build_proxy --mount=type=secret,id=build_ca \
    set -e; if [ -f /run/secrets/build_proxy ]; then export HTTPS_PROXY="$(cat /run/secrets/build_proxy)" HTTP_PROXY="$(cat /run/secrets/build_proxy)"; fi; \
    if [ -f /run/secrets/build_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/build_ca; fi; \
    npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node server.js ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
