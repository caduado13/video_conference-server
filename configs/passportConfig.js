const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs")

passport.use(new LocalStrategy(
  { usernameField: 'user' },
  async (username, password, done) => {
    try {
      const userVerification = await User.findOne({ user: username });

      if (!userVerification) {
        return done(null, false, { message: 'User not found' });
      }

      const passVerification = userVerification.password;
      const confirmationPass = bcrypt.compareSync(password, passVerification);

      if (!confirmationPass) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, userVerification);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport