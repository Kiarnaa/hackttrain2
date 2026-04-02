const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controller/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/', auth, me);

module.exports = router;
