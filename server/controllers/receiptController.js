const Receipt = require('../models/Receipt');

exports.saveReceipt = async (req, res) => {
    try {
        // Expect restaurantId and restaurantName from the frontend when saving a receipt
        const { firstName, lastName, streetAddress, city, phone, email, cart, restaurantId, restaurantName, totalPrice } = req.body;

        console.log('Received cart items:', cart);
        console.log('Received total price:', totalPrice);

        // Calculate total price from cart items if not provided
        const calculatedTotalPrice = totalPrice || cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            const itemTotal = price * quantity;
            console.log(`Item: ${item.foodName}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
            return sum + itemTotal;
        }, 0);

        console.log('Final total price:', calculatedTotalPrice);

        const receipt = new Receipt({
            firstName,
            lastName,
            streetAddress,
            city,
            phone,
            email,
            totalPrice: calculatedTotalPrice,
            cart: cart.map(item => ({
                ...item,
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 0
            })),
            restaurantId,
            restaurantName
        });

        console.log('Saving receipt with total price:', receipt.totalPrice);
        await receipt.save();
        console.log('Receipt saved successfully');
        res.status(201).json({ message: 'Receipt saved successfully', receipt });
    } catch (err) {
        console.error('Error saving receipt:', err);
        res.status(500).json({ message: 'Error saving receipt', error: err });
    }
};

exports.getReceiptsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const receipts = await Receipt.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(receipts);
    } catch (err) {
        console.error('Error fetching receipts by email:', err);
        res.status(500).json({ message: 'Error fetching receipts', error: err });
    }
};

exports.getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params; // Get restaurantId from URL parameters
        const orders = await Receipt.find({ restaurantId }).sort({ createdAt: -1 }); // Find by restaurantId
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching restaurant orders:', err);
        res.status(500).json({ message: 'Error fetching restaurant orders', error: err });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Receipt.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await Receipt.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markOrderAsCompleted = async (req, res) => {
    try {
        const order = await Receipt.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'completed';
        await order.save();
        res.json({ message: 'Order marked as completed', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
