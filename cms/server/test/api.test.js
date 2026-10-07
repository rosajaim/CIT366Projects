const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const request = require("supertest");
const MongoStore = require("connect-mongo");
const { hashPassword } = require("../auth");
const { readConfig } = require("../config");
const { createApp } = require("../app");
const { initializeCounters } = require("../routes/resources");
let app, store, config, agent, csrf, sessionCookie;
const password = crypto.randomBytes(20).toString("hex");
const dbName = "cms_test_" + crypto.randomBytes(8).toString("hex");
before(async () => {
  const base = process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27018";
  const uri = new URL(base);
  uri.pathname = "/" + dbName;
  await mongoose.connect(uri.toString(), { serverSelectionTimeoutMS: 5000 });
  await initializeCounters();
  config = readConfig({
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD_HASH: await hashPassword(password),
    SESSION_SECRET: crypto.randomBytes(32).toString("hex"),
    APP_ORIGIN: "http://localhost:3000",
  });
  store = MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: "sessions",
  });
  app = createApp(config, store);
  agent = request.agent(app);
  const session = await agent.get("/api/auth/session").expect(200);
  const login = await agent
    .post("/api/auth/login")
    .set("Origin", config.origin)
    .set("X-CSRF-Token", session.body.csrfToken)
    .send({ username: "admin", password })
    .expect(200);
  csrf = login.body.csrfToken;
  sessionCookie = login.headers["set-cookie"][0].split(";")[0];
});
after(async () => {
  if (mongoose.connection.readyState) {
    assert.ok(mongoose.connection.name.startsWith("cms_test_"));
    await mongoose.connection.dropDatabase();
  }
  if (store) await store.close();
  await mongoose.disconnect();
});
const mutate = (method, path, body) =>
  agent[method](path)
    .set("Origin", config.origin)
    .set("X-CSRF-Token", csrf)
    .send(body);
test("production config refuses missing credentials and insecure origins", () => {
  assert.throws(() => readConfig({ NODE_ENV: "production" }), /Missing/);
  assert.throws(
    () =>
      readConfig({
        ...process.env,
        NODE_ENV: "production",
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD_HASH: config.passwordHash,
        SESSION_SECRET: "x".repeat(32),
        MONGODB_URI: "mongodb://127.0.0.1/cms",
        APP_ORIGIN: "http://example.com",
      }),
    /HTTPS/,
  );
});
test("all data is protected and writes require CSRF and matching origin", async () => {
  for (const name of ["contacts", "documents", "messages"]) {
    await request(app)
      .get("/api/" + name)
      .expect(401);
    await request(app)
      .post("/api/" + name)
      .send({})
      .expect(403);
  }
  await agent
    .post("/api/documents")
    .set("Origin", config.origin)
    .send({})
    .expect(403);
  await agent
    .post("/api/documents")
    .set("Origin", "https://evil.example")
    .set("X-CSRF-Token", csrf)
    .send({})
    .expect(403);
});
test("contact, document and message CRUD preserve fields and references", async () => {
  let response = await mutate("post", "/api/contacts", {
    name: "Alice",
    email: "alice@example.com",
  }).expect(201);
  const contact = response.body.obj.find((c) => c.name === "Alice");
  response = await mutate("post", "/api/contacts", {
    name: "Team",
    email: "team@example.com",
    group: [{ id: contact.id }],
  }).expect(201);
  assert.equal(
    response.body.obj.find((c) => c.name === "Team").group[0].name,
    "Alice",
  );
  await mutate("patch", "/api/contacts/" + contact.id, {
    name: "Alice Updated",
    email: "alice@example.com",
  }).expect(200);
  response = await mutate("post", "/api/documents", {
    name: "Guide",
    description: "Original",
    url: "https://example.com/guide",
  }).expect(201);
  const doc = response.body.obj.find((d) => d.name === "Guide");
  response = await mutate("patch", "/api/documents/" + doc.id, {
    name: "Updated Guide",
    description: "Updated",
    url: "https://example.com/new",
  }).expect(200);
  assert.equal(
    response.body.obj.find((d) => d.id === doc.id).description,
    "Updated",
  );
  response = await mutate("post", "/api/messages", {
    subject: "Hello",
    msgText: "Actual message body",
    sender: contact.id,
  }).expect(201);
  const message = response.body.obj.find((m) => m.subject === "Hello");
  assert.equal(message.msgText, "Actual message body");
  assert.equal(message.sender, contact.id);
  response = await mutate("patch", "/api/messages/" + message.id, {
    subject: "Edited",
    msgText: "Edited body",
    sender: contact.id,
  }).expect(200);
  assert.equal(
    response.body.obj.find((m) => m.id === message.id).msgText,
    "Edited body",
  );
  await mutate("delete", "/api/contacts/" + contact.id).expect(200);
  const messages = await agent.get("/api/messages").expect(200);
  assert.equal(messages.body.obj.find((m) => m.id === message.id).sender, "");
  const contacts = await agent.get("/api/contacts").expect(200);
  assert.equal(
    contacts.body.obj.find((c) => c.name === "Team").group.length,
    0,
  );
  await mutate("delete", "/api/messages/" + message.id).expect(200);
  response = await mutate("delete", "/api/documents/" + doc.id).expect(200);
  assert.ok(!response.body.obj.some((d) => d.id === doc.id));
  await mutate("delete", "/api/documents/" + doc.id).expect(404);
});
test("invalid fields, unsafe URLs, unknown references and injection are rejected", async () => {
  await mutate("post", "/api/documents", {
    name: "Unsafe",
    url: "javascript:alert(1)",
  }).expect(400);
  await mutate("post", "/api/contacts", {
    name: { $ne: null },
    email: "invalid",
  }).expect(400);
  await mutate("post", "/api/contacts", {
    name: "Team",
    email: "team@example.com",
    group: [{ id: "missing" }],
  }).expect(400);
  await mutate("post", "/api/messages", {
    subject: "Hi",
    msgText: "Body",
    sender: "missing",
  }).expect(400);
  await mutate("post", "/api/messages", {
    subject: "Hi",
    message: "Wrong field",
  }).expect(400);
});
test("concurrent inserts allocate unique IDs", async () => {
  const responses = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      mutate("post", "/api/documents", {
        name: "Concurrent " + i,
        url: "https://example.com",
      }).expect(201),
    ),
  );
  // Read after every request finishes; responses can represent intermediate snapshots.
  const all = await agent.get("/api/documents").expect(200);
  const rows = all.body.obj.filter((d) => d.name.startsWith("Concurrent"));
  assert.equal(rows.length, 10);
  assert.equal(new Set(rows.map((d) => d.id)).size, 10);
});
test("production cookies are secure and login attempts are limited", async () => {
  const production = {
    ...config,
    production: true,
    origin: "https://cms.example.com",
    trustProxy: 1,
  };
  const secured = createApp(production, store);
  const initial = await request(secured)
    .get("/api/auth/session")
    .set("X-Forwarded-Proto", "https")
    .expect(200);
  const cookie = initial.headers["set-cookie"][0];
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  const client = request.agent(createApp(config, store));
  const session = await client.get("/api/auth/session").expect(200);
  for (let i = 0; i < 10; i++)
    await client
      .post("/api/auth/login")
      .set("Origin", config.origin)
      .set("X-CSRF-Token", session.body.csrfToken)
      .send({ username: "admin", password: "incorrect" })
      .expect(401);
  await client
    .post("/api/auth/login")
    .set("Origin", config.origin)
    .set("X-CSRF-Token", session.body.csrfToken)
    .send({ username: "admin", password })
    .expect(429);
});
test("sessions survive an application instance restart and logout invalidates them", async () => {
  const renewedApp = createApp(config, store);
  const session = await request(renewedApp)
    .get("/api/auth/session")
    .set("Cookie", sessionCookie)
    .expect(200);
  assert.equal(session.body.authenticated, true);
  await mutate("post", "/api/auth/logout", {}).expect(204);
  await agent.get("/api/contacts").expect(401);
});
