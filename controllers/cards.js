/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/card');
const { OK, CREATED } = require('../errors/responses');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: _id });
    return res.status(CREATED).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById({ _id: cardId });
    if (!card) {
      throw new NotFoundError('Карты с таким id не существует');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Невозможно удалить чужую карту');
    }
    await Card.findByIdAndRemove({ _id: cardId });
    return res.status(OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      throw new NotFoundError('Карты с таким id не существует');
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      throw new NotFoundError('Карты с таким id не существует');
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};
