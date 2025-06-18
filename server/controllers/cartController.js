// server/controllers/cartController.js

const Cart = require('../models/Cart');
const Food = require('../models/foodModel');
const mongoose = require('mongoose');


exports.addToCart = async (req, res) => {
    try {

        const { foodId, customerEmail, quantity = 1 } = req.body;

        console.log('addToCart: Received payload:', { foodId, customerEmail, quantity });

        if (!foodId || !customerEmail || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ message: 'Invalid data provided. Food ID, customer email, and a positive quantity are required.' });
        }


        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            console.error('addToCart: Invalid foodId format received:', foodId);
            return res.status(400).json({ message: 'Invalid food ID format.' });
        }

        const foodItem = await Food.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found.' });
        }
        console.log('addToCart: Found food item:', foodItem.name, 'with ID:', foodItem._id);

        let customerCart = await Cart.findOne({ customerEmail });

        if (!customerCart) {
            customerCart = new Cart({ customerEmail, items: [] });
            console.log('addToCart: Created new cart for:', customerEmail);
        } else {
            console.log('addToCart: Found existing cart for:', customerEmail);
        }


        const incomingFoodObjectId = new mongoose.Types.ObjectId(foodId);


        const existingItemIndex = customerCart.items.findIndex(item => {

            const currentItemFoodId = item.foodId && mongoose.Types.ObjectId.isValid(item.foodId) ? new mongoose.Types.ObjectId(item.foodId) : null;

            console.log(`Comparing cart item ID: ${currentItemFoodId} (Type: ${typeof currentItemFoodId}) with incoming food ID: ${incomingFoodObjectId} (Type: ${typeof incomingFoodObjectId})`);

            return currentItemFoodId && currentItemFoodId.equals(incomingFoodObjectId);
        });

        if (existingItemIndex > -1) {

            customerCart.items[existingItemIndex].quantity += quantity;
            console.log('addToCart: Updated quantity for existing item:', customerCart.items[existingItemIndex].foodName);
        } else {

            customerCart.items.push({
                foodId: foodItem._id,
                foodName: foodItem.name,
                price: foodItem.price,
                quantity: quantity
            });
            console.log('addToCart: Added new item to cart:', foodItem.name);
        }

        await customerCart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart: customerCart });
    } catch (error) {
        console.error('Server error adding to cart:', error);
        res.status(500).json({ message: 'Server error during add to cart: ' + error.message });
    }
};

// FIX: Removed the stray 't' here
exports.getCart = async (req, res) => {
    try {
        const { customerEmail } = req.params;
        console.log('getCart: Fetching cart for:', customerEmail);

        // .lean() to get plain JavaScript objects, often faster for read-only ops
        const cart = await Cart.findOne({ customerEmail }).populate('items.foodId').lean();

        if (!cart) {
            console.log('getCart: Cart not found for', customerEmail, '. Returning empty cart.');
            return res.status(200).json({ customerEmail, items: [] });
        }
        console.log('getCart: Cart fetched successfully for', customerEmail, '. Items:', cart.items.length);

        // Map items to ensure foodId is present and convert _id to string for frontend consistency
        const processedItems = cart.items.map(item => ({
            ...item,
            foodId: item.foodId ? item.foodId._id.toString() : (mongoose.Types.ObjectId.isValid(item.foodId) ? item.foodId.toString() : item.foodId) // Ensure foodId is string for frontend consistency
        }));


        res.status(200).json({ ...cart, items: processedItems });
    } catch (error) {
        console.error('Server error fetching cart:', error);
        res.status(500).json({ message: 'Server error during cart retrieval: ' + error.message });
    }
};


exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { customerEmail, foodId } = req.params;
        const { quantity } = req.body;

        console.log(`updateCartItemQuantity: Received for ${customerEmail}, foodId: ${foodId}, quantity: ${quantity}`);

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
        }

        const cart = await Cart.findOne({ customerEmail });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this customer.' });
        }
        console.log('updateCartItemQuantity: Found cart. Items:', cart.items.length);

        // Ensure foodId from params is an ObjectId for comparison
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            console.error('updateCartItemQuantity: Invalid foodId format received:', foodId);
            return res.status(400).json({ message: 'Invalid food ID format.' });
        }
        const incomingFoodObjectId = new mongoose.Types.ObjectId(foodId);

        const itemToUpdate = cart.items.find(item => {

            const currentItemFoodId = item.foodId && mongoose.Types.ObjectId.isValid(item.foodId) ? new mongoose.Types.ObjectId(item.foodId) : null;
            console.log(`Comparing cart item ID: ${currentItemFoodId} with incoming ID: ${incomingFoodObjectId}`);
            return currentItemFoodId && currentItemFoodId.equals(incomingFoodObjectId);
        });

        if (!itemToUpdate) {
            console.log('updateCartItemQuantity: Food item not found in cart for update.');
            return res.status(404).json({ message: 'Food item not found in cart.' });
        }

        if (quantity === 0) {

            cart.items = cart.items.filter(item => !(item.foodId && item.foodId.equals(incomingFoodObjectId)));
            console.log('updateCartItemQuantity: Removed item as quantity is 0.');
        } else {
            itemToUpdate.quantity = quantity;
            console.log(`updateCartItemQuantity: Updated quantity to ${quantity} for ${itemToUpdate.foodName}.`);
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully.', cart });
    } catch (error) {
        console.error('Server error updating cart item quantity:', error);
        res.status(500).json({ message: 'Server error during quantity update: ' + error.message });
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        const { customerEmail, foodId } = req.params;
        console.log(`removeFromCart: Received for ${customerEmail}, foodId: ${foodId}`);

        const cart = await Cart.findOne({ customerEmail });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this customer.' });
        }
        console.log('removeFromCart: Found cart. Items before filter:', cart.items.length);


        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            console.error('removeFromCart: Invalid foodId format received:', foodId);
            return res.status(400).json({ message: 'Invalid food ID format.' });
        }
        const incomingFoodObjectId = new mongoose.Types.ObjectId(foodId);

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => {

            const currentItemFoodId = item.foodId && mongoose.Types.ObjectId.isValid(item.foodId) ? new mongoose.Types.ObjectId(item.foodId) : null;
            console.log(`Filtering cart item ID: ${currentItemFoodId} against incoming ID: ${incomingFoodObjectId}`);
            return !(currentItemFoodId && currentItemFoodId.equals(incomingFoodObjectId));
        });

        if (cart.items.length === initialLength) {
            console.log('removeFromCart: Food item not found in cart for removal.');
            return res.status(404).json({ message: 'Food item not found in cart.' });
        }
        console.log('removeFromCart: Item removed. Items after filter:', cart.items.length);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully.', cart });
    } catch (error) {
        console.error('Server error removing from cart:', error);
        res.status(500).json({ message: 'Server error during item removal: ' + error.message });
    }
};


exports.clearCart = async (req, res) => {
    try {
        const { customerEmail } = req.params;
        console.log('clearCart: Received for:', customerEmail);

        const cart = await Cart.findOne({ customerEmail });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this customer.' });
        }
        console.log('clearCart: Cart found. Clearing items.');

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: 'Cart cleared successfully.', cart });
    } catch (error) {
        console.error('Server error clearing cart:', error);
        res.status(500).json({ message: 'Server error during cart clearing: ' + error.message });
    }
};
