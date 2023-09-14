const express = require('express');
const feedRouter = require('./routes/feed');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const errorController = require('./controllers/errorController');
const multer = require('multer');
const { fileFilter, fileStorage } = require('./utils/multer');
const { init } = require('./utils/websocket');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());

app.use('/feed', feedRouter);
app.use('/auth', authRouter);
app.use(userRouter);

app.use(errorController.handleError);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    const nodeServer = app.listen(8080);
    const io = init(nodeServer);
    io.on('connection', socket => {
      console.log('a user connected');
    });
    console.log('http://localhost:8080');
  })
  .catch((err) => {
    console.error(err);
  });
