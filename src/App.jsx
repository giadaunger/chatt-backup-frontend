import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useEffect } from "react";
import io from "socket.io-client";

let socket;

function App() {
  const [input, setInput] = useState("");
  const [joined, setJoined] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io("chatt-backup-backend-production.up.railway.app:4000");

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("message:update", (messages) => {
      console.log(messages);
      setMessages(messages);
    });

    return () => {
      socket.off("connect");
      socket = null;
    };
  }, []);

  const joinRoom = () => {
    socket.emit("room:join", input);
    setJoined(true);
  };

  const sendMessage = () => {
    socket.emit("message:send", chatInput);
    setChatInput("");
  };

  return (
    <div className="App">
      {joined ? (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {messages.map((m) => (
              <p>
                {m.sender}: {m.message}
              </p>
            ))}
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button onClick={sendMessage}>Skicka</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={joinRoom}>Gå med i rum</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
