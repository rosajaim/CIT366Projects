const { Router } = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const Contact = require("../models/contact");
const Document = require("../models/document");
const Message = require("../models/message");
const Counter = mongoose.model(
  "Counter",
  new mongoose.Schema({ _id: String, value: { type: Number, required: true } }),
);
const text = (max) => z.string().trim().max(max);
const link = text(2048).refine(
  (v) =>
    !v ||
    (/^https?:\/\//i.test(v) &&
      (() => {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      })()),
  "Use an HTTP or HTTPS URL",
);
const schemas = {
  contacts: z.object({
    name: text(120).min(1),
    email: text(255).email(),
    phone: text(255).default(""),
    imageUrl: link.default(""),
    group: z
      .array(z.object({ id: text(40).min(1) }))
      .max(100)
      .default([]),
  }),
  documents: z.object({
    name: text(120).min(1),
    description: text(10000).default(""),
    url: link.min(1),
  }),
  messages: z.object({
    subject: text(120).min(1),
    msgText: text(10000).min(1),
    sender: text(40).default(""),
  }),
};
const models = { contacts: Contact, documents: Document, messages: Message };
async function initializeCounters() {
  for (const [name, Model] of Object.entries(models)) {
    await Model.init();
    const ids = await Model.find({}, { id: 1 }).lean();
    const max = Math.max(
      0,
      ...ids.map((row) => (/^\d+$/.test(row.id) ? Number(row.id) : 0)),
    );
    await Counter.updateOne(
      { _id: name },
      { $max: { value: max } },
      { upsert: true },
    );
  }
}
function bad(message) {
  const e = new Error(message);
  e.status = 400;
  throw e;
}
async function normalize(name, input, existing) {
  const data = schemas[name].parse(input);
  if (name === "contacts") {
    const ids = data.group.map((c) => c.id);
    if (new Set(ids).size !== ids.length || ids.includes(existing?.id))
      bad("Invalid contact group");
    const members = await Contact.find({ id: { $in: ids } });
    if (members.length !== ids.length) bad("Unknown group contact");
    data.group = members.map((c) => c._id);
  }
  if (name === "messages") {
    if (data.sender) {
      const sender = await Contact.findOne({ id: data.sender });
      if (!sender) bad("Unknown sender");
      data.sender = sender._id;
    } else data.sender = null;
  }
  return data;
}
async function list(name) {
  let query = models[name].find().sort({ id: 1 });
  if (name === "contacts") query = query.populate("group");
  const rows = await query.lean();
  if (name === "messages") {
    const contacts = await Contact.find({}, { id: 1 }).lean();
    const ids = new Map(contacts.map((c) => [String(c._id), c.id]));
    rows.forEach((r) => {
      r.sender = ids.get(String(r.sender)) || "";
    });
  }
  return {
    [name === "contacts"
      ? "contact"
      : name === "documents"
        ? "document"
        : "messages"]: "Success",
    obj: rows,
  };
}
function resourceRouter(name) {
  const router = Router();
  const Model = models[name];
  router.get("/", async (req, res) => res.json(await list(name)));
  router.post("/", async (req, res) => {
    const data = await normalize(name, req.body);
    const counter = await Counter.findOneAndUpdate(
      { _id: name },
      { $inc: { value: 1 } },
      { returnDocument: "after" },
    );
    await Model.create({ ...data, id: String(counter.value) });
    res.status(201).json(await list(name));
  });
  router.patch("/:id", async (req, res) => {
    const row = await Model.findOne({ id: req.params.id });
    if (!row) return res.status(404).json({ error: "Record not found" });
    const data = await normalize(name, req.body, row);
    Object.assign(row, data);
    await row.save();
    res.json(await list(name));
  });
  router.delete("/:id", async (req, res) => {
    const row = await Model.findOne({ id: req.params.id });
    if (!row) return res.status(404).json({ error: "Record not found" });
    if (name === "contacts") {
      await Contact.updateMany(
        { group: row._id },
        { $pull: { group: row._id } },
      );
      await Message.updateMany({ sender: row._id }, { $set: { sender: null } });
    }
    await row.deleteOne();
    res.json(await list(name));
  });
  return router;
}
module.exports = { resourceRouter, initializeCounters };
