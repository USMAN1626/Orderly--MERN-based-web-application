// server/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
    // FIX: Changed 'CartController' to 'cartController' to match file name casing
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/:customerEmail', getCart);
router.put('/:customerEmail/:foodId', updateCartItemQuantity);
router.delete('/:customerEmail/:foodId', removeFromCart);
router.delete('/:customerEmail', clearCart);

module.exports = router;
