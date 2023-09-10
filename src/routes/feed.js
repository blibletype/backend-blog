import express from 'express';
import * as feedController from '../controllers/feedController.js';
import { body } from 'express-validator';

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
  feedController.createPost
);

export default router;
