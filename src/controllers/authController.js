const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email,
      password: hashedPassword,
      name: name
    });
    res.status(201).json({ userId: user._id });
  } catch (error) {
    next(error);
  }
}

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Could not find user with this email');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      email: email,
      userId: user._id.toString()
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    next(error);
  }
}
