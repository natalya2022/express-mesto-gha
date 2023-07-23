const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { NOT_FOUND } = require('../errors/responses');
const {
  createUser, login,
} = require('../controllers/users');
const {
  validCreateUser,
  validLogin,
} = require('../middlewares/validation');

router.post('/signup', validCreateUser, createUser);
router.post('/signin', validLogin, login);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => res.status(NOT_FOUND.status).send({
  message: 'Страница не найдена',
}));

module.exports = router;
