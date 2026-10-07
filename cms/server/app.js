const path = require("node:path");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const { authRouter, requireAdmin, csrf } = require("./auth");
const { resourceRouter } = require("./routes/resources");
function createApp(config, store) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "https:", "data:"],
          "connect-src": ["'self'"],
          "upgrade-insecure-requests": config.production ? [] : null,
        },
      },
      strictTransportSecurity: config.production ? undefined : false,
    }),
  );
  app.get("/healthz", (req, res) =>
    res
      .status(mongoose.connection.readyState === 1 ? 200 : 503)
      .json({ ready: mongoose.connection.readyState === 1 }),
  );
  app.use(
    "/api",
    express.json({ limit: "100kb" }),
    session({
      name: "cms.sid",
      secret: config.sessionSecret,
      store:
        store ||
        MongoStore.create({
          client: mongoose.connection.getClient(),
          collectionName: "sessions",
          ttl: 8 * 60 * 60,
        }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: config.production,
        maxAge: 8 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(
    "/api",
    (req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
    },
    csrf(config),
  );
  app.use("/api/auth", authRouter(config));
  for (const name of ["contacts", "documents", "messages"])
    app.use("/api/" + name, requireAdmin, resourceRouter(name));
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "API route not found" }),
  );
  const dist = path.join(__dirname, "../dist");
  app.use(express.static(dist));
  app.get("/{*path}", (req, res) =>
    res.sendFile(path.join(dist, "index.html")),
  );
  app.use((err, req, res, next) => {
    if (
      err.name === "ZodError" ||
      err.name === "ValidationError" ||
      err.name === "CastError" ||
      err.status === 400
    )
      return res.status(400).json({ error: "Invalid record or request" });
    if (err.code === 11000)
      return res.status(409).json({ error: "Record already exists" });
    if (err.status === 413)
      return res.status(413).json({ error: "Request too large" });
    console.error("Request failed:", err.name);
    res.status(500).json({ error: "Unable to complete request" });
  });
  return app;
}
module.exports = { createApp };
