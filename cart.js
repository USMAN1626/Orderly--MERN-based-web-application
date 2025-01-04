document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.querySelector('.total-price');
    const checkoutButton = document.getElementById('checkoutBtn');

    // Fetch customer email from localStorage
    const customerEmail = localStorage.getItem('email');

    if (!customerEmail) {
        alert('Please log in first!');
        window.location.href = '/log.html'; // Redirect to login if email is not found
        return;
    }

    // Initialize cart on page load 
    displayCartItems();

    // Display cart items
    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            subtotalElement.textContent = 'Rs. 0';
            totalElement.textContent = 'Rs. 0';
            return;
        }

        let subtotal = 0;

        cart.forEach((item) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <p class="food-name">${item.foodName}</p>
                    <p class="food-price">Rs. ${item.foodPrice}</p>
                    <p class="food-quantity">Quantity: ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeItem('${item.foodId}')">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            subtotal += item.foodPrice * item.quantity;
        });

        subtotalElement.textContent = `Rs. ${subtotal}`;
        totalElement.textContent = `Rs. ${subtotal}`;
    }

    // Remove item from cart
    window.removeItem = (id) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter((item) => item.foodId !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    };

    // Handle checkout
    checkoutButton.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items before proceeding.');
            return;
        }

        let subtotal = 0;
        cart.forEach((item) => {
            subtotal += item.foodPrice * item.quantity;
        });

        // Store the total price in local storage
        localStorage.setItem('totalPrice', subtotal);

        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, customerEmail }),
            });

            if (response.ok) {
                alert(' Item successfully placed!');
                // Do not clear the cart here
                window.location.href = '/checkout.html';
            } else {
                alert('Error processing your order. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Error during checkout. Please try again.');
        }
    });
});