const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Минимальная длина пароля 8 символов'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
