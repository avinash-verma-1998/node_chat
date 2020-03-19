let name = prompt("Enter a nickname to chat...");

const patt = /^[\s]+$/;
console.log(patt.test(name));
if (patt.test(name)) {
  name = null;
}
var socket = io.connect("/");

const nickname = name || "newUser" + Math.floor(Math.random() * 1000);

socket.emit("newUser", nickname);

socket.on("userJoined", name => {
  const box = document.querySelector(".message-box");
  const message = document.createElement("p");
  // message.setAttribute("autoscroll", "true");
  message.innerHTML = `<span class="new-user"> ${name} joined the chat!!!</span> `;
  document.querySelector(".message-box").appendChild(message);
  box.scrollTop = box.scrollHeight;
});

//enter sends a messgae
document.querySelector(".message").addEventListener("keydown", e => {
  if (e.keyCode === 13) {
    send();
  }
});

function send() {
  const message = document.querySelector(".message").value;
  //   console.log(message);
  const data = {};
  data.message = message;
  data.name = nickname;
  socket.emit("chatMessageSend", data);
  document.querySelector(".message").value = "";
}
socket.on("chatMessageRecieved", data => {
  const box = document.querySelector(".message-box");
  const message = document.createElement("p");
  message.setAttribute("autoscroll", "true");
  message.textContent = data.name + ":" + data.message;
  document.querySelector(".message-box").appendChild(message);
  box.scrollTop = box.scrollHeight;
});
