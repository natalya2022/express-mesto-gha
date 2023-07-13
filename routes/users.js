const router = require('express').Router();
const {
  getUsers, getUserId, createUser, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

module.exports = router;
