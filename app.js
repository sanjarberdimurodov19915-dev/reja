// app.js
const express = require("express");
const { ObjectId } = require("mongodb");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   VIEW ENGINE
======================= */
app.set("views", "views");
app.set("view engine", "ejs");

/* =======================
   HELPERS
======================= */
const getDb = (req) => req.app.locals.db;

/* =======================
   ROUTES
======================= */

// HOME
app.get("/", async (req, res) => {
  try {
    const db = getDb(req);
    const items = await db.collection("plans").find().toArray();
    res.render("reja", { items });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// CREATE
app.post("/create-item", async (req, res) => {
  try {
    const db = getDb(req);
    const result = await db.collection("plans").insertOne(req.body);

    res.json({
      _id: result.insertedId,
      ...req.body,
    });
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  }
});

// DELETE ONE
app.post("/delete-item", async (req, res) => {
  try {
    const db = getDb(req);
    await db.collection("plans").deleteOne({
      _id: new ObjectId(req.body.id),
    });

    res.json({ state: "success" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// UPDATE
app.post("/edit-item", async (req, res) => {
  try {
    const db = getDb(req);
    const { id, new_input } = req.body;

    await db.collection("plans").updateOne(
      { _id: new ObjectId(id) },
      { $set: { reja: new_input } },
    );

    res.json({ state: "success" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE ALL
app.post("/delete-all", async (req, res) => {
  try {
    if (req.body.delete_all) {
      const db = getDb(req);
      await db.collection("plans").deleteMany({});
      res.json({ state: "hamma rejalar ochirildi" });
    }
  } catch (err) {
    res.status(500).json({ error: "Delete all failed" });
  }
});

module.exports = app;