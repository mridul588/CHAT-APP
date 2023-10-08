// import  chats  from "./data/data.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import  messageRoutes from "./Routes/messageRoutes.js"
import { notFound , errorHandler } from "./middleware/errorMiddleware.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// const server = http.createServer(app)

connectDB();
// app.get("/",(req,res) => {
//     res.send("all set");
// })

// app.get("/chat",(req,res) => {
//     res.send(chats);
// })
// app.get("/chat/:id", (req, res) => {
//     // console.log(req);
//     console.log("Received request with id:", req.params.id);
//     const singleChat = chats.find(c => c._id === req.params.id);
//     console.log("Found chat:", singleChat);
//     res.send(singleChat);
// });

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

//--------------------------Deployment---------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
     app.use(express.static(path.join(__dirname1,'/frontend/dist')));

     app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname1 ,"frontend" ,"dist" , "index.html"));
     });
}else{
    app.get("/",(req,res) => {
        res.send("API  is Running");
    })
}

//------------------------------Deployment--------------

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);

const io = new Server(server,{pingTimeout: 60000
    ,cors : {origin : "http://localhost:5173"}});


io.on('connection', (socket)=>{
    console.log('Connected to socket', socket.id);
    socket.on('setup',(userData) => {
      socket.join(userData._id);
      console.log(userData._id);
      socket.emit("connected");
    });

    socket.on('join chat',(room) => {
        socket.join(room);
        console.log("User joined room: "+room);
    });


  socket.on("typing", (room)=> socket.in(room).emit("typing"));
  socket.on("stop typing",(room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users)return console.log("chat.users not dfined");

        chat.users.forEach(user=> {
            if(user._id === newMessageRecieved.sender._id) return;

            socket.in(chat._id).emit("message recieved",newMessageRecieved);
        });
    });
});