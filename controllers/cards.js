const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return res.status(500).send({
      message: 'Ошибка в работе сервера',
      err,
    });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req, req.body, req.user);
    const { _id } = req.user;
    const { name, link } = req.body;
    // eslint-disable-next-line no-console
    console.log(name, link, _id);
    const card = await Card.create({ name, link, owner: _id });
    return res.status(201).send(card);
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

// module.exports.getUserId = async (req, res) => {
//   try {
//     const { id } = req.params.id;
//     const user = await User.findById({ id });
//     // eslint-disable-next-line no-console
//     console.log(user);
//     return res.status(200).send(user);
//   } catch (err) {
//     if (err.kind === 'ObjectId') {
//       return res.status(400).send({
//         message: 'Ошибочные данные. Пользователя с таким id не существует',
//         err,
//       });
//     }
//     return res.status(500).send({
//       message: 'Ошибка в работе сервера',
//       err,
//     });
//   }
// };
