import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";
  const location = window.location;

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room }, () => {
      socket.on("message", (message) => {
        console.log("message", message);
        setMessages((m) => [...m, message]);
      });
    });
    return () => {
      socket.emit("disconnection");
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    // console.log("REFRESH");
    // socket.on("message", (message) => {
    //   console.log("message", message);
    //   setMessages((m) => [...m, message]);
    // });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      console.log("send", message);
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer" style={{ border: "1px solid green" }}>
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        {/* <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        /> */}
      </div>
    </div>
  );
};

export default Chat;
