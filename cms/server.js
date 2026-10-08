const mongoose = require("mongoose");
const { readConfig } = require("./server/config");
const { createApp } = require("./server/app");
const { initializeCounters } = require("./server/routes/resources");
let startupStage = "configuration";
async function start() {
  const config = readConfig();
  startupStage = "MongoDB connection";
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  startupStage = "database initialization";
  await initializeCounters();
  startupStage = "application initialization";
  const app = createApp(config);
  const server = app.listen(config.port, () =>
    console.log(`CMS listening on port ${config.port}`),
  );
  async function shutdown() {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  }
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}
start().catch((error) => {
  console.error(
    "CMS startup failed:",
    `stage=${startupStage}`,
    error.name === "Error" && /Missing|Invalid|must/.test(error.message)
      ? error.message
      : error.name,
  );
  // Only emit known diagnostic codes, never raw database messages or URIs.
  const codes = [error.code, error.cause?.code];
  for (const code of codes) {
    if (Number.isInteger(code)) console.error("MongoDB error code:", code);
    else if (["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ECONNRESET"].includes(code))
      console.error("Network error code:", code);
  }
  if (error.code === 18 || /authentication failed|bad auth/i.test(error.message || ""))
    console.error("MongoDB authentication failed: check the Atlas database user and URI password.");
  else if (error.code === 13)
    console.error("MongoDB permission denied: grant the database user readWrite on cms_preview.");
  else if (/querySrv|queryTxt/i.test(error.message || ""))
    console.error("MongoDB DNS lookup failed: check the cluster hostname in MONGODB_URI.");
  process.exit(1);
});
