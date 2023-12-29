const express = require("express")
const session = require("express-session")
const app  = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "kltv2568",
    resave: false,
    saveUninitialized: true,    
}))