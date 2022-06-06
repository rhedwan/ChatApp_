const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Admin";

// Set static folder
app.use(express.static(path.join(__dirname, "./public")));
// console.log(path.join(__dirname, "public"));

//Run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome new user
    socket.emit("message", formatMessage(botName, "Welcome to ChatAPP"));

    //Broadcast when a user connect
    socket.broadcast.emit(
      "message",
      formatMessage(botName, "A user has joined the chat")
    );
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
    console.log(msg);
  });

  //   Runs when client disconnect
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
