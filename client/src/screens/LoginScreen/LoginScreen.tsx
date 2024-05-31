import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login-screen.scss";
import { ws } from "../../App";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform login logic here
    console.log("Username:", username);
    console.log("Password:", password);

    ws.send(JSON.stringify({ name: username, password: password }));

    // Navigate to the lobby screen after login
    navigate("/deckbuilder");
  };

  return (
    <div className="screen login-container">
      <h1 className="header">Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            className="login-input"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
