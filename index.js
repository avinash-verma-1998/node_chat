const express = require("express");
const app = express();

const http = require("http");
const fromidable = require("formidable");
const server = http.createServer(app);
const io = require("socket.io")(server);

const path = require("path");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Tracking users

const users = [];
let serialid = 0;
io.sockets.on("connection", function(socket) {
  //tracking user
  console.log("a user connected");

  serialid++;
  users.push(serialid);
  console.log(users.length);
  //sending message
  socket.on("newUser", name => {
    io.emit("userJoined", name);
  });
  socket.on("chatMessageSend", data => {
    timeStamp = Date.now();
    data.time = timeStamp;

    io.emit("chatMessageRecieved", data);
  });
  //handling disconnects
  socket.on("disconnect", () => {
    console.log("a user is disconnected");
    users.pop();
    console.log(users.length);
  });
});

app.get("/updata", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "formUpload.html"));
});

app.post("/updata", upload);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("server is listening on " + PORT);
});

//upload func

function upload(req, res) {
  const type = req.headers["content-type"] || "";

  if (type.indexOf("multipart/form-data") !== 0) {
    res.json({ error: "no form data provided " });
  }

  const form = new fromidable.IncomingForm({
    uploadDir: path.join(__dirname, "files")
  });

  form.on("field", function(field, value) {
    console.log(field);
    console.log(value);
  });
  form.on("progress", function(bytesReceived, bytesExpected) {
    var percent = Math.floor((bytesReceived / bytesExpected) * 100);
    console.log(percent);
  });
  form.on("end", function() {
    res.end("upload complete!");
  });
  form.parse(req);
}
