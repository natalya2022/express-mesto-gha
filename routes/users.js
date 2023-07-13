const router = require('express').Router();
const {
  getUsers, getUserId, createUser, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

module.exports = router;
