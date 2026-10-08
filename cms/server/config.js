const crypto = require("node:crypto");
function readConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const publicOrigin = env.APP_ORIGIN || env.RENDER_EXTERNAL_URL;
  for (const name of ["ADMIN_USERNAME", "ADMIN_PASSWORD_HASH"]) {
    if (!env[name])
      throw new Error(`Missing ${name}. See README.md for setup.`);
  }
  if (!/^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(env.ADMIN_PASSWORD_HASH))
    throw new Error("Invalid ADMIN_PASSWORD_HASH format");
  if (production) {
    for (const name of ["MONGODB_URI", "SESSION_SECRET"])
      if (!env[name]) throw new Error(`Missing ${name}`);
    if (!publicOrigin)
      throw new Error("Missing APP_ORIGIN or RENDER_EXTERNAL_URL");
    if (env.SESSION_SECRET.length < 32)
      throw new Error("SESSION_SECRET must have at least 32 characters");
    if (!publicOrigin.startsWith("https://"))
      throw new Error("APP_ORIGIN must use HTTPS in production");
  }
  const origin = publicOrigin || "http://localhost:4200";
  if (new URL(origin).origin !== origin)
    throw new Error(
      "APP_ORIGIN must be an origin without a path or trailing slash",
    );
  const trustProxy = Number(env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(trustProxy) || trustProxy < 0)
    throw new Error("Invalid TRUST_PROXY_HOPS");
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");
  return {
    production,
    origin,
    trustProxy,
    port,
    mongoUri: env.MONGODB_URI || "mongodb://127.0.0.1:27017/cms",
    username: env.ADMIN_USERNAME,
    passwordHash: env.ADMIN_PASSWORD_HASH,
    sessionSecret: env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  };
}
module.exports = { readConfig };
