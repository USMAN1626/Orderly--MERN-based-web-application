const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/restaurantController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
