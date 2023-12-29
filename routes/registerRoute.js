const express = require("express")
const loginController = require("../controllers/loginController")
const registerRouter = express.Router()

registerRouter.post("/register", loginController.register)
module.exports = registerRouter