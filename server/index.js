const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const router = require("./router");
const { SocketAddress } = require("net");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`We have a new connection !!`);

  socket.on("join", ({ name, room }) => {
    console.log(name, room);
  });
  socket.on("disconnect", () => {
    console.log("User has left !!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
