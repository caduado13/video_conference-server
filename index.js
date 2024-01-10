require("dotenv").config();

const express = require("express");
const server = express();

const cors = require("cors");
const mongoose = require("mongoose");

const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const passport= require("./configs/passportConfig");

const session = require("express-session");
const homeRouter = require("./routes/homeRoute");


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
        server.listen(process.env.PORT, () => {
          console.log("Server running on PORT:", process.env.PORT);
        });

})


