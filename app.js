const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connector() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
}

connector()
// eslint-disable-next-line no-console
  .then(() => console.log('connect'))
// eslint-disable-next-line no-console
  .catch((err) => console.error(err));

app.use((req, res, next) => {
  req.user = {
    _id: '64ada5056b10e43fcd41d350',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
