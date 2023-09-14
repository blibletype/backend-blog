const Post = require('../models/post.js');
const User = require('../models/user');
const { clearImage } = require('../utils/fs.js');
const { getIO } = require('../utils/websocket');

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate('creator');
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
      creator: req.userId,
    });
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: 'post created',
      post: post,
      creator: {
        _id: user._id,
        name: user.name
      }
    });
    getIO().emit('posts',
      { action: 'create',
        post: {
          ...post._doc,
          creator: { _id: req.userId, name: user.name }
        }
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
      const post = await Post.findById(id).populate('creator');
      if (!post) throw new Error();
      if (post.creator._id.toString() !== req.userId) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      await post.save();
      getIO().emit('posts', {
        action: 'update',
        post: post
      });
      res.status(200).json({ post });
    } catch (error) {
      error.message = 'Could not find post';
      error.statusCode = error.statusCode || 404;
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
    if (!post) {
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }
    await post.deleteOne();
    getIO().emit('posts', { action: 'delete', post: id });
    const creator = await User.findById(req.userId);
    creator.posts.pull(id);
    await creator.save();
    clearImage(post.imageUrl);
    res.status(200).json({ message: 'Post successfully deleted' });
  } catch (error) {
    next(error);
  }
};
