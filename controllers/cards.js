const Card = require('../models/card');
// const {
//   OK,
//   CREATED,
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR } = require('../errors/responses');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: _id });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(404).send({
        message: 'Карта с указанным id отсутствует',
      });
    }
    const card = await Card.findByIdAndRemove({ _id: cardId });
    return res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(404).send({
        message: 'Карта с указанным id отсутствует',
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(404).send({
        message: 'Карта с указанным id отсутствует',
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};
