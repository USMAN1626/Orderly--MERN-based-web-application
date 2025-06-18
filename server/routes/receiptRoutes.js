const express = require('express');
const router = express.Router();
const { 
    saveReceipt, 
    getReceiptsByEmail, 
    getRestaurantOrders,
    deleteOrder,
    markOrderAsCompleted 
} = require('../controllers/receiptController');

router.post('/', saveReceipt); // To save new receipts
router.get('/:email', getReceiptsByEmail); // To get customer's past receipts
router.get('/restaurant/:restaurantId', getRestaurantOrders); // To get restaurant's orders
router.delete('/:id', deleteOrder); // To delete an order
router.put('/:id/complete', markOrderAsCompleted); // To mark an order as completed

module.exports = router;
