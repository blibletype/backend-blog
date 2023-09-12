const express = require('express');
const isAuth = require('../middleware/isAuth');
const userController = require('../controllers/userController');

const router = express.Router();

// GET /status
router.get('/status', isAuth, userController.getUserStatus);

// PATCH /status
router.patch('/status', isAuth, userController.updateUserStatus);

module.exports = router;