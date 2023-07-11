// const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test')
  // eslint-disable-next-line no-console
  .then(() => console.log('ok'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

const schema = new mongoose.Schema({ name: String, size: String });
const Tank = mongoose.model('Tank', schema);

Tank.create({ size: 'small' });

// small.save();

// or

// or, for inserting large batches of documents
// await Tank.insertMany([{ size: 'small' }]);
