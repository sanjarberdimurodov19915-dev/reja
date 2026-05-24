// server.js
const http = require("http");
const { MongoClient } = require("mongodb");
const app = require("./app");
require("dotenv").config();

// 🔴 Atlas’dagi database nomi bilan AYNAN bir xil bo‘lsin
const DB_NAME = "Reja";

const CONNECTION_STRING = process.env.MONGO_URI;

const client = new MongoClient(CONNECTION_STRING);

async function start() {
  try {
    await client.connect();
    console.log("MongoDB connection succeed");

    // db ni app ga ulab qo‘yamiz
    app.locals.db = client.db(DB_NAME);

    const server = http.createServer(app);
    const PORT = process.env.PORT || 3010;

    server.listen(PORT, () => {
      console.log("Web server starts");
      console.log(`Server: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

start();

// 🔻 Graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});