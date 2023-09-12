const Post = require('../models/post.js');
const { clearImage } = require('../utils/fs.js');

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      posts: posts,
      totalItems: totalItems
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
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

exports.createPost = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path.replace(/src\\/g, '').replace(/\\/g, '/');
    const { title, content } = req.body;
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
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

exports.editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path.replace(/src\\/g, '').replace(/\\/g, '/');
    }
    if (!imageUrl) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      throw error;
    }

    // find alternatives to refactor this
    try {
      const post = await Post.findById(id);
      if (!post) throw new Error();
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      await post.save();
      res.status(200).json({ post });
    } catch (error) {
      error.message = 'Could not find post';
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) throw new Error();
    await post.deleteOne();
    clearImage(post.imageUrl);
    res.status(200).json({ message: 'Post successfully deleted' });
  } catch (error) {
    error.message = 'Could not find post';
    error.statusCode = 404;
    next(error);
  }
};
