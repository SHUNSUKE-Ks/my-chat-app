import ChatBox from './components/ChatBox';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <ChatBox defaultName="ユーザーA" />
      <ChatBox defaultName="ユーザーB" />
    </div>
  );
}

export default App;