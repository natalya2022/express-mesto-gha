const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { NOT_FOUND } = require('../errors/responses');
const {
  createUser, login,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => res.status(NOT_FOUND.status).send({
  message: 'Страница не найдена',
}));

module.exports = router;
