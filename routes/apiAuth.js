const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.apiRegister);
router.post('/login', authController.apiLogin);

module.exports = router; 