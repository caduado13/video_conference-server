const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require("../models/User");


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

  const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);
      
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })

passport.use(jwtStrategy);

async function authJWT(req, res, next) {
    // Use o middleware do Passport.js para autenticação JWT
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'DEU MERDA AQUI.' });
      }
    
      if (!user) {
        return res.status(401).json({ message: 'Autenticação JWT falhou.', user });
      }
  
      // Adiciona informações do usuário à requisição
      req.user = user;

      // Prossiga para a próxima middleware ou rota
      next();
    })(req, res, next);
  }


module.exports = {jwtStrategy, authJWT};