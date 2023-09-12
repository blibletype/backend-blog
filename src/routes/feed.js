const express = require('express');
const feedController = require('../controllers/feedController');
const errorController = require('../controllers/errorController');
const { body } = require('express-validator');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// GET /feed/posts/:id
router.get('/posts/:id', feedController.getPost);

// POST /feed/posts
router.post(
  '/post',
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
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  errorController.validate,
  feedController.editPost
);

//DELETE /feed/posts/:id
router.delete('/posts/:id', feedController.deletePost);

module.exports = router;
