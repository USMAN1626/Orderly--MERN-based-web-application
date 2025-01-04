document.addEventListener('DOMContentLoaded', () => {
  const totalPrice = localStorage.getItem('totalPrice');
  const totalPriceElement = document.getElementById('totalPrice');
  totalPriceElement.textContent = `Rs. ${totalPrice}`;

  // Populate cart items in checkout
  const cartItemsContainer = document.getElementById('cartItems');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  console.log('Cart:', cart); // Debugging log

  if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<tr><td colspan="3">Your cart is empty.</td></tr>';
      return;
  }

  cartItemsContainer.innerHTML = ''; // Clear existing items

  cart.forEach((item) => {
      const cartItemRow = document.createElement('tr');
      cartItemRow.classList.add('summary-item');
      cartItemRow.innerHTML = `
          <td>${item.foodName}</td>
          <td>${item.quantity}</td>
          <td>Rs. ${item.foodPrice * item.quantity}</td>
      `;
      cartItemsContainer.appendChild(cartItemRow);
  });

  // Handle order placement
  document.getElementById('finalizeOrderBtn').addEventListener('click', async () => {
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const streetAddress = document.getElementById('streetAddress').value;
      const city = document.getElementById('city').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;

      const orderDetails = {
          firstName,
          lastName,
          streetAddress,
          city,
          phone,
          email,
          totalPrice,
          cart
      };

      console.log('Order Details:', orderDetails); // Debugging log

      // Save order details to local storage
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

      // Send order details to the backend
      try {
          const response = await fetch('http://localhost:5000/api/receipt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderDetails),
          });

          if (response.ok) {
              console.log('Receipt saved successfully');
              // Redirect to receipt page
              window.location.href = '/receipt.html';
          } else {
              console.error('Error saving receipt:', response.statusText);
              alert('Error saving receipt. Please try again.');
          }
      } catch (error) {
          console.error('Error during receipt save:', error);
          alert('Error during receipt save. Please try again.');
      }
  });
});