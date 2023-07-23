/* eslint-disable consistent-return */
const { checkToken } = require('../utils/token');
const {
  UNAUTHORIZED,
} = require('../errors/responses');

const checkAuth = (req, res, next) => {
  if (!req.cookies) {
    return res.status(UNAUTHORIZED.status).send({
      message: UNAUTHORIZED.message,
    });
  }
  const token = req.cookies.jwt;
  const result = checkToken(token);
  req.user = result;
  if (!result) {
    return res.status(UNAUTHORIZED.status).send({
      message: UNAUTHORIZED.message,
    });
  }
  next();
};

module.exports = checkAuth;
