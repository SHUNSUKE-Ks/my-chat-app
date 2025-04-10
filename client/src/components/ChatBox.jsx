// ChatBox.jsx
import { useEffect, useState } from 'react';
import socket from "../utils/socket";// 変更ポイント：utils/socket.js にまとめてエクスポート
import './ChatBox.css';

const ChatBox = ({ defaultName }) => {
  const [username, setUsername] = useState(defaultName);
  const [newName, setNewName] = useState('');
  const [nameList, setNameList] = useState([defaultName]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // ソケット受信時の処理
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message'); // クリーンアップ
  }, []);

  // メッセージ送信
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', { user: username, text: message });
    setMessage('');
  };

  // 名前の追加
  const registerNewName = () => {
    if (newName.trim() && !nameList.includes(newName)) {
      setNameList([...nameList, newName]);
      setUsername(newName);
      setNewName('');
    }
  };

  // 名前の削除
  const deleteCurrentName = () => {
    if (nameList.length === 1) return alert('最後の名前は削除できません');
    const updated = nameList.filter((n) => n !== username);
    setNameList(updated);
    setUsername(updated[0]);
  };

  return (
    <div className="chat-container">
      <h3 className="chat-header">ようこそ、チャットアプリへ</h3>

      <div className="name-box">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="名前を入力" />
        <button onClick={registerNewName}>登録</button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            {nameList.map((n, i) => (
              <option key={i} value={n}>{n}</option>
            ))}
          </select>
          <button onClick={deleteCurrentName} style={{
            background: 'none', border: 'none', marginLeft: '5px', cursor: 'pointer', fontSize: '18px'
          }}>🗑️</button>
        </div>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <p key={i} className={`chat-message ${msg.user === username ? 'left' : 'right'}`}>
            <strong>{msg.user}</strong>: {msg.text}
          </p>
        ))}
      </div>

      <input
        className="chat-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="メッセージを入力"
      />
      <button className="chat-send-button" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
