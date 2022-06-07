const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const logOutBtn = document.querySelector("#logout-btn");

let chats;
let existingChats = JSON.parse(localStorage.getItem("chats"));
if (JSON.parse(localStorage.getItem("chats")) === null) {
  chats = [];
  window.localStorage.setItem("chats", JSON.stringify(chats));
} else {
  chats = existingChats;
}

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit("joinRoom", {
  username,
  room,
});

// Get room user
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // outputMessage(message);
  // console.log(message);

  if (JSON.parse(window.localStorage.getItem("chats")) == null) {
    chats = [];
    window.localStorage.setItem("chats", JSON.stringify(chats));
  }
  chats.push(message);
  window.localStorage.setItem("chats", JSON.stringify(chats));

  console.log(existingChats);
  outputMessage(existingChats);

  // Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to the server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(availableChats) {
  const div = document.createElement("div");
  div.classList.add("message");

  // div.innerHTML = `
  // <p class="meta">${message.username} <span>${message.time}</span></p>
  //   <p class="text">${message.text}</p>
  // `;

  // chatMessages.append(div);

  // existingChats = JSON.parse(localStorage.getItem("chats"));
  // console.log(existingChats);
  // chats = existingChats;
  // console.log(availableChats.map((i) => i.text));

  // availableChats.map((chat) => {
  //   div.innerHTML = ` <p class="meta">${chat.username} <span>${chat.time}</span></p>
  //   <p class="text">${chat.text}</p>`;
  //   chatMessages.append(div);
  // });

  chatMessages.innerHTML = `${availableChats
    .map(
      (chat) =>
        `<div class='message'> <p class="meta">${chat.username} <span>${chat.time}</span></p> <p class="text">${chat.text}</p> </div>`
    )
    .join("")}`;
}

// function old(availableChats) {
//   chatMessages.innerHTML = `${availableChats
//     .map(
//       (chat) =>
//         `<div class='message'> <p class="meta">${chat.username} <span>${chat.time}</span></p> <p class="text">${chat.text}</p> </div>`
//     )
//     .join("")}`;
// }

// old(existingChats);

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}

logOutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("chats");
});

setTimeout(() => {
  window.localStorage.removeItem("chats");
}, 1000 * 60 * 30);
