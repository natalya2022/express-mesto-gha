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
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.params.userId);
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    // eslint-disable-next-line no-console
    console.log(user);
    if (!user) {
      return res.status(404).send({
        message: 'Юзер с указанным id не найден',
      });
    }
    return res.status(200).send(user);
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

module.exports.createUser = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.body);
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
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

module.exports.updateUser = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.body, req.user);
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true });
    return res.status(200).send(user);
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

module.exports.updateAvatar = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.body, req.user);
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true });
    return res.status(200).send(user);
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
