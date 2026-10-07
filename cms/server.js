const mongoose = require("mongoose");
const { readConfig } = require("./server/config");
const { createApp } = require("./server/app");
const { initializeCounters } = require("./server/routes/resources");
async function start() {
  const config = readConfig();
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
  await initializeCounters();
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
    error.name === "Error" && /Missing|Invalid|must/.test(error.message)
      ? error.message
      : error.name,
  );
  process.exit(1);
});
