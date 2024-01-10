const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport")
const jwt = require('jsonwebtoken');

const loginController =  {
    register: async (req, res) => {
        const userVerification = await User.findOne({user:req.body.user});
        if(userVerification) return res.status(404).json({errors:{user:"Account already exists!"}});

        try {
            const userValidation = {
                user: req.body.user,
                password:req.body.password,
            }
            const newUser = new User(userValidation);
            
            await newUser.validate()

            newUser.password = bcrypt.hashSync(newUser.password, 10);
            const addUser = await User.create(newUser);
            return res.status(200).json(addUser);
    
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                
                for (const field in error.errors) {
                  validationErrors[field] = error.errors[field].message;
                }
                console.log(validationErrors)
                return res.status(400).json({ errors: validationErrors });
              }
            return res.status(400).send(error);
        }
    },
    login: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            return next(err);
          }
      
          if (!user) {
            return res.status(404).send(info.message);
          }
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);  
          
      
          req.logIn(user, (loginErr) => {
            if (loginErr) {
              return next(loginErr);
            }
      
            req.session.userSession = user.user;
            const userSession = req.session.userSession;
            res.json({ token, message: `Olá, ${userSession}!` });
          });
        })(req, res, next);
      },
}

module.exports = loginController;
