const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const { User, userSchemaObject } = require('../models/user');
const User = require('../models/user');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require('../errors/responses');
const { generateToken } = require('../utils/token');
const logErrors = require('../errors/logger');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
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
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (await User.findOne({ email })) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED).send(user);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(UNAUTHORIZED.status).send({
        message: UNAUTHORIZED.message,
      });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(UNAUTHORIZED.status).send({
        message: UNAUTHORIZED.message,
      });
    }
    const payload = { _id: user._id };
    const token = generateToken(payload);
    res.cookie('jwt', token);
    return res.status(OK).send(payload);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(UNAUTHORIZED.status).send({
        message: UNAUTHORIZED.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(OK).send(user);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST.status).send({
        message: BAD_REQUEST.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.status).send({
      message: INTERNAL_SERVER_ERROR.message,
    });
  }
};
