const express = require('express');
const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const errorController = require('./controllers/errorController');
const multer = require('multer');
const { fileFilter, fileStorage } = require('./utils/multer');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use(errorController.handleError);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(8080);
    console.log('server up');
  })
  .catch((err) => {
    console.error(err);
  });
