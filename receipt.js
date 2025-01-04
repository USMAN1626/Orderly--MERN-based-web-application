document.addEventListener('DOMContentLoaded', async () => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    if (!orderDetails) {
        alert('No order details found.');
        return;
    }

    // Display receipt
    const receiptContainer = document.getElementById('receipt');
    receiptContainer.innerHTML = `
        <h2>Order Receipt</h2>
        <p><strong>Name:</strong> ${orderDetails.firstName} ${orderDetails.lastName}</p>
        <p><strong>Address:</strong> ${orderDetails.streetAddress}, ${orderDetails.city}</p>
        <p><strong>Phone:</strong> ${orderDetails.phone}</p>
        <p><strong>Email:</strong> ${orderDetails.email}</p>
        <p><strong>Total Price:</strong> Rs. ${orderDetails.totalPrice}</p>
        <h3>Items:</h3>
        <ul>
            ${orderDetails.cart.map(item => `
                <li>${item.foodName} - Qty: ${item.quantity} - Price: Rs. ${item.price * item.quantity}</li>
            `).join('')}
        </ul>
    `;

    // Send order details to the backend
    try {
        const response = await fetch('http://localhost:5000/api/receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
        });

        if (response.ok) {
            console.log('Receipt saved successfully');
        } else {
            console.error('Error saving receipt:', response.statusText);
            alert('Error saving receipt. Please try again.');
        }
    } catch (error) {
        console.error('Error during receipt save:', error);
        alert('Error during receipt save. Please try again.');
    }
});