const mongoose = require('mongoose');
const User = require('../models/user');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/responses');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
      err,
    });
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(NOT_FOUND.status).send({
        message: NOT_FOUND.message,
      });
    }
    return res.status(OK).send(user);
  } catch (err) {
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

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(CREATED).send(user);
  } catch (err) {
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

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
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

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
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
