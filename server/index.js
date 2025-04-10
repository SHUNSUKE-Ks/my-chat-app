const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ✅ CORSの設定（開発用：全許可）
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// ✅ Socket.ioのCORS設定
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 📄 ログファイルのパス
const logPath = path.join(__dirname, "chatLog.json");

// 🧩 ログファイル初期化（なければ作成）
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "[]", "utf8");
}

// 🔁 Socket.io イベント登録
io.on("connection", (socket) => {
  console.log("✅ 新しいクライアントが接続しました");

  socket.on("send_message", (data) => {
    console.log("📩 メッセージ受信:", data);

    // ファイル読み込み + エラーハンドリング
    let logs = [];
    try {
      const file = fs.readFileSync(logPath, "utf8");
      logs = JSON.parse(file || "[]");
    } catch (err) {
      console.error("❌ ログ読み込みエラー:", err);
    }

    // メッセージ追加＆保存
    logs.push(data);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), "utf8");

    // 全体にブロードキャスト
    io.emit("receive_message", data);
  });
});

// 🚀 サーバー起動
server.listen(3000, () => {
  console.log("🚀 サーバー起動：http://localhost:3000");
});
