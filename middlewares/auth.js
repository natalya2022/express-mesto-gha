/* eslint-disable consistent-return */
const { checkToken } = require('../utils/token');
const UnauthorizedError = require('../errors/unauthorized-err');

const checkAuth = (req, res, next) => {
  if (!req.cookies) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  const token = req.cookies.jwt;
  const result = checkToken(token);
  req.user = result;
  if (!result) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  next();
};

module.exports = checkAuth;
