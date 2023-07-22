const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
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

app.use((req, res, next) => {
  req.user = {
    _id: '64ada5056b10e43fcd41d350',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
