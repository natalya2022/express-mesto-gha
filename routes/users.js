const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const {
  validGetUserId,
  validUpdateUser,
  validUpdateAvatar,
} = require('../middlewares/validation');
const checkAuth = require('../middlewares/auth');

router.use(checkAuth);

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validGetUserId, getUserId);
router.patch('/me', validUpdateUser, updateUser);
router.patch('/me/avatar', validUpdateAvatar, updateAvatar);

module.exports = router;
