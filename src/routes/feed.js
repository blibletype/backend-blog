const express = require('express');
const feedController = require('../controllers/feedController');
const errorController = require('../controllers/errorController');
const isAuth = require('../middleware/isAuth');
const { body } = require('express-validator');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// GET /feed/posts/:id
router.get('/posts/:id', isAuth, feedController.getPost);

// POST /feed/posts
router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  errorController.validate,
  feedController.createPost
);

// PUT /feed/posts/:id
router.put(
  '/posts/:id',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  errorController.validate,
  feedController.editPost
);

//DELETE /feed/posts/:id
router.delete('/posts/:id', isAuth, feedController.deletePost);

module.exports = router;
