const router = require('express').Router();
const { NOT_FOUND } = require('../errors/responses');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => res.status(NOT_FOUND).send({
  message: 'Неизвестный endpoint',
}));

module.exports = router;
