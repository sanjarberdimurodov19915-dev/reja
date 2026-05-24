// server.js
const http = require("http");
const { MongoClient } = require("mongodb");
const app = require("./app");

// 🔴 Atlas’dagi database nomi bilan AYNAN bir xil bo‘lsin
const DB_NAME = "Reja";

const CONNECTION_STRING =
  "mongodb://sanjar_sam_dev_1191:HOHvYcMPnQQAHVba@ac-tfux50z-shard-00-00.fthdmjx.mongodb.net:27017,ac-tfux50z-shard-00-01.fthdmjx.mongodb.net:27017,ac-tfux50z-shard-00-02.fthdmjx.mongodb.net:27017/Reja?ssl=true&replicaSet=atlas-qzcrmq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(CONNECTION_STRING);

async function start() {
  try {
    await client.connect();
    console.log("MongoDB connection succeed");

    // db ni app ga ulab qo‘yamiz
    app.locals.db = client.db(DB_NAME);

    const server = http.createServer(app);
    const PORT = process.env.PORT || 3000;

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