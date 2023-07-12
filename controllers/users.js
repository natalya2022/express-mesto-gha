const User = require('../models/user');

// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch((err) => res.status(500).send({ message: err.message }));
// };

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

// module.exports.getUserId = (req, res) => {
//   // const { id } = req.params.id;
//   User.findById(req.params.id)
//     .then((user) => res.send(user))
//     .catch((err) => res.status(500).send({ message: err.message }));
// };

module.exports.getUserId = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.params);
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    // eslint-disable-next-line no-console
    console.log(user);
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({
        message: 'Ошибочные данные. Пользователя с таким id не существует',
        err,
      });
    }
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

// eslint-disable-next-line no-unused-vars
// module.exports.createUser = (req, res) => {
//   // eslint-disable-next-line no-console
//   console.log(req.body);
//   const { name, about, avatar } = req.body;

//   User.create({ name, about, avatar })
//     .then(() => res.send({ name, about, avatar }))
//     .catch((err) => res.status(500).send({ message: err.message }));
// };

module.exports.createUser = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.body);
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
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
