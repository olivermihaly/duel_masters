import DeckBuilderScreen from "./screens/DeckBuilder/DeckBuilderScreen";
import GameScreen from "./screens/GameScreen";
import LobbyScreen from "./screens/LobbyScreen";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import "./styles.scss";
import { Routes, Route, MemoryRouter } from "react-router-dom";

export const ws = new WebSocket("ws://localhost:8080");

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
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route element={<LobbyScreen />} />
          <Route element={<GameScreen />} />
          <Route path="/deckbuilder" element={<DeckBuilderScreen />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
