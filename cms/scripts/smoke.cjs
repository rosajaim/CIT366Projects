const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const mongoose = require("mongoose");
const { chromium } = require("playwright-core");
const { hashPassword } = require("../server/auth");
const dbName = "cms_smoke_" + crypto.randomBytes(8).toString("hex");
(async () => {
  const db = new URL(
    process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27018",
  );
  db.pathname = "/" + dbName;
  const password = crypto.randomBytes(20).toString("hex");
  const port = process.env.TEST_PORT || "3100";
  const origin = "http://localhost:" + port;
  let browser, child;
  try {
    child = spawn(process.execPath, ["server.js"], {
      cwd: require("node:path").join(__dirname, ".."),
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: port,
        MONGODB_URI: db.toString(),
        APP_ORIGIN: origin,
        ADMIN_USERNAME: "testadmin",
        ADMIN_PASSWORD_HASH: await hashPassword(password),
        SESSION_SECRET: crypto.randomBytes(32).toString("hex"),
      },
    });
    child.stderr.on("data", (data) => process.stderr.write(data));
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Server startup timed out")),
        15000,
      );
      child.once("exit", () => {
        clearTimeout(timer);
        reject(new Error("Server exited during startup"));
      });
      child.stdout.on("data", (data) => {
        if (data.toString().includes("CMS listening")) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
    browser = await chromium.launch({
      executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => {
      errors.push(e.message);
      console.error("Browser exception:", e.message);
    });
    page.on("response", (r) => {
      if (r.url().includes("/api/"))
        console.log("API", new URL(r.url()).pathname, r.status());
    });
    await page.goto(origin);
    await page.getByLabel("Username", { exact: true }).fill("testadmin");
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("link", { name: "Documents", exact: true }).waitFor();
    await page.getByRole("link", { name: "Add Document" }).click();
    await page.getByLabel("Document title").fill("Browser Guide");
    await page.getByLabel("Document description").fill("Created in browser");
    await page.getByLabel("Document URL").fill("https://example.com/guide");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page
      .getByRole("link", { name: "Browser Guide", exact: true })
      .click();
    await page.getByText("Created in browser", { exact: true }).waitFor();
    await page.reload();
    await page.getByText("Created in browser", { exact: true }).waitFor();
    await page.getByText("Edit", { exact: true }).click();
    await page.getByLabel("Document title").fill("Edited Browser Guide");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page
      .getByRole("link", { name: "Edited Browser Guide", exact: true })
      .click();
    await page.getByText("Delete", { exact: true }).click();
    await page.waitForURL("**/documents");
    assert.equal(
      await page
        .getByRole("link", { name: "Edited Browser Guide", exact: true })
        .count(),
      0,
    );
    console.log("PASS: browser login and document create/edit/delete/reload");
    await page.getByRole("link", { name: "Contacts", exact: true }).click();
    await page.getByRole("button", { name: "New Contact" }).click();
    await page.getByLabel("Name", { exact: true }).fill("Browser Contact");
    await page.getByLabel("Email", { exact: true }).fill("browser@example.com");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page
      .getByRole("heading", { name: "Browser Contact", exact: true })
      .click();
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    await page
      .getByLabel("Name", { exact: true })
      .fill("Edited Browser Contact");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await page
      .getByRole("heading", { name: "Edited Browser Contact", exact: true })
      .click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.waitForURL("**/contacts");
    console.log("PASS: browser contact create/edit/delete");
    await page.getByRole("link", { name: "Messages", exact: true }).click();
    await page.getByLabel("Subject", { exact: true }).fill("Browser subject");
    await page
      .getByLabel("Message", { exact: true })
      .fill("Browser message body");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.getByText("Browser message body", { exact: true }).waitFor();
    assert.equal(
      await page.getByText("Browser message body", { exact: true }).count(),
      1,
    );
    await page
      .getByRole("button", { name: "Edit message", exact: true })
      .click();
    await page
      .getByLabel("Edit message body", { exact: true })
      .fill("Edited browser message");
    await page
      .getByRole("button", { name: "Save message", exact: true })
      .click();
    await page.getByText("Edited browser message", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "Delete message", exact: true })
      .click();
    await page
      .getByText("Edited browser message", { exact: true })
      .waitFor({ state: "detached" });
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.getByRole("button", { name: "Sign in", exact: true }).waitFor();
    assert.equal(
      await page.getByRole("link", { name: "Documents", exact: true }).count(),
      0,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: message body persistence, logout, no browser exceptions",
    );
  } finally {
    if (browser) await browser.close();
    if (child && child.exitCode === null) {
      const stopped = new Promise((resolve) => child.once("exit", resolve));
      child.kill("SIGTERM");
      await stopped;
    }
    await mongoose.connect(db.toString());
    assert.ok(mongoose.connection.name.startsWith("cms_smoke_"));
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
