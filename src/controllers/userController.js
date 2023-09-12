const User = require('../models/user');

exports.getUserStatus = async (req, res, next) => {
  try {
  const user = await User.findById(req.userId);
  res.status(200).json({ status: user.status });
  } catch (error) {
    next(error);
  }
}

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.userId);
    if (status && status !== user.status) {
      user.status = status;
      await user.save();
    }
    res.status(200).json({ message: 'status successfully changed' });
  } catch (error) {
    next(error);
  }
}