/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const { User, userSchemaObject } = require('../models/user');
const User = require('../models/user');
const {
  OK,
  CREATED,
  // BAD_REQUEST,
  // NOT_FOUND,
  // INTERNAL_SERVER_ERROR,
  // UNAUTHORIZED,
} = require('../errors/responses');
const { generateToken } = require('../utils/token');
const logErrors = require('../errors/logger');

const BadRequestError = require('../errors/bad-request-err');
// const InternalServerError = require('../errors/internal-server-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
// const ForbiddenError = require('../errors/forbidden-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    // logErrors(req.user, req.params, req.body, err);
    // return res.status(500).send({
    //   err,
    // });
    next(err);
  }
};
//  {
// logErrors(req.user, req.params, req.body, err);
// return res.status(INTERNAL_SERVER_ERROR.status).send({
//   message: 'Ошибка сервера',
// });
//   next(new InternalServerError('Ошибка сервера'));
// }

module.exports.getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new NotFoundError('Указанный id не найден');
      // return res.status(NOT_FOUND.status).send({
      //   message: 'Указанный id не найден',
      // });
    }
    return res.status(OK).send(user);
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (await User.findOne({ email })) {
      throw new ConflictError('Данный email уже зарегистрирован');
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED).send({
      _id: user._id, email: user.email, name: user.name, about: user.about, avatar: user,
    });
  } catch (err) {
    logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при создании пользователя'));
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
    // logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при введении данных'));
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
    // logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при введении данных'));
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверный email или пароль');
      // return res.status(UNAUTHORIZED.status).send({
      //   message: 'Неверный email или пароль',
      // });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неверный email или пароль');
      // return res.status(UNAUTHORIZED.status).send({
      //   message: 'Неверный email или пароль',
      // });
    }
    const payload = { _id: user._id };
    const token = generateToken(payload);
    res.cookie('jwt', token);
    return res.status(OK).send(payload);
  } catch (err) {
    // logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.ValidationError) {
      next(new UnauthorizedError('Неверный email или пароль'));
      // return res.status(UNAUTHORIZED.status).send({
      //   message: 'Неверный email или пароль',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(OK).send(user);
  } catch (err) {
    // logErrors(req.user, req.params, req.body, err);
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
      // return res.status(BAD_REQUEST.status).send({
      //   message: 'Ошибка при введении данных',
      // });
    }
    next(err);
    // return res.status(INTERNAL_SERVER_ERROR.status).send({
    //   message: 'Ошибка сервера',
    // });
  }
};
