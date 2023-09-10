import { validationResult } from 'express-validator';
import Post from '../models/post.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) throw new Error();
    res.status(200).json({ post });
  } catch (error) {
    error.message = 'Could not find post';
    error.statusCode = 404;
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      throw error;
    }
    const { title, content } = req.body;
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: 'images/book.jpg',
      creator: {
        name: 'blibletype',
      },
    });
    res.status(201).json({
      message: 'post created',
      post: post,
    });
  } catch (error) {
    next(error);
  }
};
