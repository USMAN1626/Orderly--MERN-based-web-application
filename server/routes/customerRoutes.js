const express = require('express');
const router = express.Router();
const {
    signup, login,
    resetPasswordRequest,
    resetPassword
} = require('../controllers/customerController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);

module.exports = router;
