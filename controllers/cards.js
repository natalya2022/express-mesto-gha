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

// const logErrors = (err) => {
//   const now = new Date();
//   fs.appendFile('error.log', `${now.toUTCString()} ${JSON.stringify(err)}\n`, () => {});
// };

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (err) {
    logErrors(req.user, req.params, err);
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
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
        message: BAD_REQUEST.message,
        err,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
    });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(NOT_FOUND.status).send({
        message: NOT_FOUND.message,
      });
    }
    const card = await Card.findByIdAndRemove({ _id: cardId });
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(req.user, req.params, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
        err,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
    });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(NOT_FOUND.status).send({
        message: NOT_FOUND.message,
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
        err,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
    });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!await Card.findById({ _id: cardId })) {
      return res.status(NOT_FOUND.status).send({
        message: NOT_FOUND.message,
      });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(OK).send(card);
  } catch (err) {
    logErrors(err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
        err,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
    });
  }
};
