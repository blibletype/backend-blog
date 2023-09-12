const express = require('express');
const authController = require('../controllers/authController');
const errorController = require('../controllers/errorController');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

// PUT /auth/signup
router.put('/signup',[
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) return Promise.reject('email already exist');
    }),
  body('name')
    .trim()
    .not()
    .isEmpty(),
  body('password')
    .trim()
    .isLength({ min: 5 })
], errorController.validate, authController.signup);

module.exports = router;