const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connect
io.on("connection", (socket) => {
  socket.emit("message", "Welcome to ChatAPP");

  //Broadcast when a user connect
  socket.broadcast.emit("message", "A user has joined the chat");
  //   Runs when client disconnect
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
