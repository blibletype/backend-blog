import express from 'express';
import feedRouter from './routes/feed.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import fileDirName from './utils/fileDirName.js';
import * as errorController from './controllers/errorController.js';
import dotenv from 'dotenv';
dotenv.config();
const { __dirname, __filename } = fileDirName(import.meta);

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

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
