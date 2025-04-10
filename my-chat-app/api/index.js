
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const server = createServer(app);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("✅ クライアント接続");

  socket.on("send_message", (data) => {
    console.log("📩 メッセージ受信:", data);
    io.emit("receive_message", data);
  });
});

if (require.main === module) {
  server.listen(3000, () => {
    console.log("🚀 サーバー起動：http://localhost:3000");
  });
}

module.exports = app;
