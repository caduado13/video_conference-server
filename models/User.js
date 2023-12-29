const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    user: {type:String, required:true, minlength: 3, maxlength: 50},
    password: {type:String, required:true, minlength: 8, maxlength: 200},
    createdAt: {type: Date, default: Date.now},
    admin: {type: Boolean, default: false}
})

userSchema.methods.verifyPassword = function (password) {
    console.log(bcrypt.compareSync(password, this.password))
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model("user", userSchema)