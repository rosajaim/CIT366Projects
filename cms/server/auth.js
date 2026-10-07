const crypto = require("node:crypto");
const { promisify } = require("node:util");
const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const scrypt = promisify(crypto.scrypt);
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {N:32768,r:8,p:3,maxmem:64*1024*1024});
  return `scrypt-v1$${salt}$${key.toString("hex")}`;
}
async function checkPassword(password, hash) {
  const [, salt, expected] = hash.split("$");
  const actual = await scrypt(password, salt, 64, {N:32768,r:8,p:3,maxmem:64*1024*1024});
  return crypto.timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
function token(req) {
  return (req.session.csrf ||= crypto.randomBytes(32).toString("hex"));
}
function csrf(config) {
  return (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const origin = req.get("origin");
    const value = req.get("x-csrf-token");
    if (origin !== config.origin || !value || value !== req.session.csrf)
      return res.status(403).json({ error: "Invalid request token or origin" });
    next();
  };
}
function requireAdmin(req, res, next) {
  if (!req.session.admin)
    return res.status(401).json({ error: "Sign in required" });
  next();
}
function authRouter(config) {
  const router = Router();
  router.get("/session", (req, res) =>
    res.json({
      authenticated: Boolean(req.session.admin),
      username: req.session.admin || null,
      csrfToken: token(req),
    }),
  );
  router.post(
    "/login",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
    async (req, res) => {
      const { username, password } = req.body || {};
      if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        password.length > 1024
      )
        return res.status(400).json({ error: "Invalid sign-in request" });
      const valid = await checkPassword(password, config.passwordHash);
      if (!valid || username !== config.username)
        return res.status(401).json({ error: "Invalid username or password" });
      await new Promise((resolve, reject) =>
        req.session.regenerate((err) => (err ? reject(err) : resolve())),
      );
      req.session.admin = config.username;
      const csrfToken = token(req);
      await new Promise((resolve, reject) =>
        req.session.save((err) => (err ? reject(err) : resolve())),
      );
      res.json({ authenticated: true, username: config.username, csrfToken });
    },
  );
  router.post("/logout", requireAdmin, async (req, res) => {
    await new Promise((resolve, reject) =>
      req.session.destroy((err) => (err ? reject(err) : resolve())),
    );
    res.clearCookie("cms.sid", {
      httpOnly: true,
      sameSite: "strict",
      secure: config.production,
    });
    res.status(204).end();
  });
  return router;
}
module.exports = { hashPassword, authRouter, requireAdmin, csrf };
