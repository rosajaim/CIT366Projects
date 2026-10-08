const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readConfig } = require("../config");
const { hashPassword, checkPassword } = require("../password");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const base = {
  NODE_ENV: "production",
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD_HASH: "scrypt-v1$" + "a".repeat(32) + "$" + "b".repeat(128),
  SESSION_SECRET: "s".repeat(32),
  MONGODB_URI: "mongodb://127.0.0.1/cms_preview",
};
test("Render assigned HTTPS URL is used without a manual origin", () => {
  const config = readConfig({
    ...base,
    RENDER_EXTERNAL_URL: "https://welearn-cms-preview.onrender.com",
    PORT: "10000",
    TRUST_PROXY_HOPS: "1",
  });
  assert.equal(config.origin, "https://welearn-cms-preview.onrender.com");
  assert.equal(config.port, 10000);
  assert.equal(config.trustProxy, 1);
});
test("explicit custom origin overrides Render URL and still requires HTTPS", () => {
  assert.equal(
    readConfig({
      ...base,
      RENDER_EXTERNAL_URL: "https://preview.onrender.com",
      APP_ORIGIN: "https://cms.example.com",
    }).origin,
    "https://cms.example.com",
  );
  assert.throws(
    () =>
      readConfig({
        ...base,
        RENDER_EXTERNAL_URL: "https://preview.onrender.com",
        APP_ORIGIN: "http://cms.example.com",
      }),
    /HTTPS/,
  );
  assert.throws(
    () =>
      readConfig({
        ...base,
        RENDER_EXTERNAL_URL: "http://preview.onrender.com",
      }),
    /HTTPS/,
  );
  assert.throws(
    () =>
      readConfig({
        ...base,
        RENDER_EXTERNAL_URL: "https://preview.onrender.com/path",
      }),
    /without a path/,
  );
  assert.throws(() => readConfig(base), /Missing APP_ORIGIN/);
});
test("password hashing CLI works without application dependencies and verifies the password", async () => {
  const password = "Test-only password 12345!";
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, "../../scripts/hash-password.js")],
    { input: password + "\n", encoding: "utf8" },
  );
  assert.equal(result.status, 0);
  const hash = result.stdout.trim();
  assert.match(hash, /^scrypt-v1\$/);
  assert.equal(await checkPassword(password, hash), true);
  assert.equal(await checkPassword("wrong password", hash), false);
  const rejected = spawnSync(
    process.execPath,
    [path.join(__dirname, "../../scripts/hash-password.js")],
    { input: "short\n", encoding: "utf8" },
  );
  assert.equal(rejected.status, 1);
  assert.equal(rejected.stdout, "");
});
