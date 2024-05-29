import DeckBuilderScreen from "./screens/DeckBuilder/DeckBuilderScreen";
import "./styles.scss";

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
  ws.send(JSON.stringify({ name: "username", password: "password" }));
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log(response);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};

function App() {
  return (
    <div className="App">
      <DeckBuilderScreen />
    </div>
  );
}

export default App;
