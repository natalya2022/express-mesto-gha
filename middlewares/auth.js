/* eslint-disable consistent-return */
const { checkToken } = require('../utils/token');
// const {
//   UNAUTHORIZED,
// } = require('../errors/responses');
const UnauthorizedError = require('../errors/unauthorized-err');

const checkAuth = (req, res, next) => {
  if (!req.cookies) {
    throw new UnauthorizedError('Ошибка авторизации');
    // return res.status(UNAUTHORIZED.status).send({
    //   message: UNAUTHORIZED.message,
    // });
  }
  const token = req.cookies.jwt;
  const result = checkToken(token);
  req.user = result;
  if (!result) {
    throw new UnauthorizedError('Ошибка авторизации');
    // return res.status(UNAUTHORIZED.status).send({
    //   message: UNAUTHORIZED.message,
    // });
  }
  next();
};

module.exports = checkAuth;
