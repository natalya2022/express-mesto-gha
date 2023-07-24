const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
// const logErrors = require('./errors/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookies());
app.use(express.json());
app.use(cors());

async function connector() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
}

connector()
  .then(() => console.log('connect'))
  .catch((err) => console.error(err));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64ada5056b10e43fcd41d350',
//   };
//   next();
// });

app.use(router);

app.use(errors());
app.use((err, req, res, next) => {
  console.log(err);
  // logErrors(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
