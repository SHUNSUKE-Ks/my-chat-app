import ChatBox from './components/ChatBox';
import socket from './utils/socket';


function App() {
  return (
    <div style={{ display: 'flex' }}>
      <ChatBox defaultName="ユーザーA" />
      <ChatBox defaultName="ユーザーB" />
    </div>
  );
}

export default App;