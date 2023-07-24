const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const checkAuth = require('../middlewares/auth');
const {
  validCreateCard,
  validCard,
} = require('../middlewares/validation');

router.use(checkAuth);

router.get('/', getCards);
router.post('/', validCreateCard, createCard);
router.delete('/:cardId', validCard, deleteCard);
router.put('/:cardId/likes', validCard, likeCard);
router.delete('/:cardId/likes', validCard, dislikeCard);

module.exports = router;
