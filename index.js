const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages.js")

const app = express();
const socket = require("socket.io");

require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes );

app.use("/api/messages", messageRoutes);


// mongodb connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB Connection Successfully")
}).catch((err)=>{
console.log(err.message)
})

//server
const server = app.listen(process.env.PORT, ()=>{
    console.log(` Server Started on Port ${process.env.PORT}`)
})

// socket implement
const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});