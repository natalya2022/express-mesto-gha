const { default: mongoose } = require('mongoose');
const User = require('../models/user');
// const {
//   OK,
//   CREATED,
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
// } = require('../errors/responses');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({
      message: 'Ошибка сервера',
      err,
    });
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).send({
        message: 'Юзер с указанным id не найден',
      });
    }
    return res.status(200).send(user);
  } catch (err) {
    // if (err.kind === 'ObjectId') {
    if (err instanceof mongoose.CastError) {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
      err,
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    // if (err.name === 'ValidationError') {
    if (err instanceof mongoose.ValidationError) {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
      err,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.ValidationError) {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
      err,
    });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.ValidationError) {
      return res.status(400).send({
        message: 'Ошибка при введении данных',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка сервера',
      err,
    });
  }
};
