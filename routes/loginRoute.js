const express = require("express");
const loginRouter = express.Router();

const loginController = require("../controllers/loginController");
const passport = require("passport");

loginRouter.post("/login", passport.authenticate("local"), loginController.login)

module.exports = loginRouter