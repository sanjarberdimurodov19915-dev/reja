console.log("Web server starts");
const express = require("express");
const app = express();

/* MongoDB choqirish */
const clientDB = require("./server");
const db = clientDB.db();
const mongodb = require("mongodb");

// 1.KIRISH CODE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2.SESSION CODE
// 3.VIEW CODE
app.set("views", "views");
app.set("view engine", "ejs");

// 4.ROUTER
app.post("/create-item", (req, res) => {
  console.log("post /create-item");

  const reja = req.body;
  db.collection("plans").insertOne(reja, (err, data) => {
    res.json(data.ops[0]);
  });
});

app.post("/delete-item", (req, res) => {
  console.log("post /delete-item");

  const id = req.body.id;
  db.collection("plans").deleteOne(
    { _id: new mongodb.ObjectId(id) },
    function (err, data) {
      res.json({ state: "success" });
    },
  );
});

app.post("/edit-item", (req, res) => {
  console.log("post /edit-item");

  const data = req.body;
  console.log(data);
  db.collection("plans").findOneAndUpdate(
    { _id: new mongodb.ObjectId(data.id) },
    { $set: { reja: data.new_input } },
    function (err, data) {
      res.json({ state: "success" });
    },
  );
});

app.post("/delete-all", (req, res) => {
  console.log("post /delete-all");

  if (req.body.delete_all) {
    db.collection("plans").deleteMany(function () {
      res.json({ state: "hamma rejalar ochirildi" });
    });
  }
});

app.get("/", function (req, res) {
  console.log("get /");

  db.collection("plans")
    .find()
    .toArray((err, data) => {
      res.render("reja", { items: data });
    });
});

module.exports = app;
