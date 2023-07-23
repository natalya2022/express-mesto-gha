const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserId, createUser, updateUser, updateAvatar, login, getUserInfo,
} = require('../controllers/users');
const checkAuth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(checkAuth);

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.get('/me', getUserInfo);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
