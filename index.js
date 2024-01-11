require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const mongoose = require("mongoose");
const http = require("http")
const socketIO = require("socket.io")

const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const homeRouter = require("./routes/homeRoute");
const passport= require("./configs/passportConfig");

const server = express();

const httpServer = http.createServer(server);
const io = socketIO(httpServer, {
  cors: {
    origin: "http://localhost:3000", // ou "*" para permitir qualquer origem
    methods: ["GET", "POST"],
  },
});

server.use(cors());
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,    
}));


server.use(passport.initialize());
server.use(passport.session());
server.use(express.json());

server.use(async (req, res, next) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

      if (!token) {
        return next();
      }
      next();
      
    } catch (error) {
      console.error('Erro ao verificar autenticação JWT:', error);
      res.status(500).json({ message: 'Erro interno do servidor ao verificar autenticação JWT.' });
    }
  });

server.use("/", registerRouter)
server.use("/", loginRouter);
server.use("/", homeRouter)

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to database");
    httpServer.listen(process.env.PORT, () => {
      console.log('Server running on PORT:', process.env.PORT);
    });
});

const usersOnServer = []

io.on("connection", (socket)=>{
  socket.on("new_user", (data)=> {
    if (typeof data === "string" && data.trim() !== "") {
      socket.username = data;
      if (!usersOnServer.includes(data)) {
        usersOnServer.push(data);
      }
      io.emit("users", usersOnServer);
    }
  });

  socket.on("disconnect", () => {
    const index = usersOnServer.indexOf(socket.username);
    if (index !== -1) {
      usersOnServer.splice(index, 1);
      io.emit("users", usersOnServer);
    }
  });
})


