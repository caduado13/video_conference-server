require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");

const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const passport = require("./configs/passportConfig")
const session = require("express-session");
//const loginRouter = require("./routes/loginRoute");


app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.json(), registerRouter)
app.use("/", express.json(), loginRouter)

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
        console.log("Server running on PORT:", process.env.PORT)
    })
})
