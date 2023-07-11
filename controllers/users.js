const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUsersId = (req, res) => {
  const { id } = req.params;
  User.find((user) => user._id === id)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// eslint-disable-next-line no-unused-vars
module.exports.createUser = (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.body);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(() => res.send({ name, about, avatar }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
