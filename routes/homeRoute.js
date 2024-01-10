const express = require('express');
const homeRouter = express.Router();
const { authJWT } = require('../configs/passportJWT');

homeRouter.get('/', authJWT, (req, res) => {
  return res.status(200).json({ message: 'Rota protegida acessada com sucesso.', data: req.user});
});

module.exports = homeRouter;