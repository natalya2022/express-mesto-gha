const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/responses');

const logErrors = require('../errors/logger');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (err) {
    logErrors(req.user, req.params, err);
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: _id });
    return res.status(CREATED).send(card);
  } catch (err) {
    logErrors(req.user, req.params, err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST.status).send({
        message: 'Ошибка при введении данных',
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById({ _id: cardId });
    if (!card) {
      return res.status(NOT_FOUND.status).send({
        message: 'Указанный id не найден',
      });
    }
    if (card.owner.toString() !== req.user._id) {
      return res.status(403).send({
        message: 'Невозможно удалить чужую карту',
      });
    }
    await Card.findByIdAndRemove({ _id: cardId });
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(req.user, req.params, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: 'Ошибка при введении данных',
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(NOT_FOUND.status).send({
        message: 'Указанный id не найден',
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(req.user, req.params, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: 'Ошибка при введении данных',
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: 'Ошибка сервера',
    });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(NOT_FOUND.status).send({
        message: 'Указанный id не найден',
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(req.user, req.params, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: 'Ошибка при введении данных',
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: 'Ошибка сервера',
    });
  }
};
