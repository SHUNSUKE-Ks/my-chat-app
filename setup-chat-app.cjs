#!/usr/bin/env node
// ✅ Vercel用チャットアプリ自動セットアップスクリプト（CJS版）

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2];
if (!projectName) {
  console.error("❌ プロジェクト名を指定してください (例: node setup-chat-app.cjs my-chat-app)");
  process.exit(1);
}

const rootDir = path.join(process.cwd(), projectName);
const clientDir = path.join(rootDir, "client");
const apiDir = path.join(rootDir, "api");

console.log("[INFO] プロジェクト作成中...\n");

// client: React + Vite
execSync(`npm create vite@latest ${projectName}/client -- --template react`, { stdio: "inherit" });
execSync(`cd ${projectName}/client && npm install`, { stdio: "inherit", shell: true });

// api: Express + Socket.io
fs.mkdirSync(apiDir, { recursive: true });

const apiCode = `
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
`;

fs.writeFileSync(path.join(apiDir, "index.js"), apiCode, "utf8");

// vercel.json を生成
const vercelConfig = {
  rewrites: [
    { source: "/socket.io/:path*", destination: "/api/index.js" },
    { source: "/api/:path*", destination: "/api/index.js" }
  ]
};

fs.writeFileSync(
  path.join(rootDir, "vercel.json"),
  JSON.stringify(vercelConfig, null, 2),
  "utf8"
);

console.log("\n✅ プロジェクト作成完了！");
console.log("▶ 次の手順:");
console.log(`  cd ${projectName}/client && npm run dev`);
console.log(`  cd ${projectName}/api && node index.js (ローカルテスト用)`);
