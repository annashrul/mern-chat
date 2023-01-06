const express = require("express");
const http = require("http");
const PORT = process.env.PORT || 5000;
const router = require("./router");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { create, remove, get, getBy } = require("./users.js");

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = create({
      id: socket.id,
      name,
      room,
    });
    if (error) return callback(error);
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room ${user.room}`,
    });
    console.log("############## JOINING", user);

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });

    socket.join(user.room);

    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = get(socket.id);
    console.log("#################### SEND MESSAGE ##########", user);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });
  socket.on("disconnection", () => {
    const user = remove(socket.id);
    console.log("User had left !!", socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
