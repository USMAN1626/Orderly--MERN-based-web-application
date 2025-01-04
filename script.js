document.addEventListener('DOMContentLoaded', () => {
  function loadComponents() {
      // Load header
      fetch('header.html')
          .then(response => {
              if (!response.ok) throw new Error('Failed to load header');
              return response.text();
          })
          .then(data => document.getElementById('header').innerHTML = data)
          .catch(error => console.error('Error loading header:', error));

      // Load footer
      fetch('footer.html')
          .then(response => {
              if (!response.ok) throw new Error('Failed to load footer');
              return response.text();
          })
          .then(data => document.getElementById('footer').innerHTML = data)
          .catch(error => console.error('Error loading footer:', error));
  }

  loadComponents();
});

// Fetch food items from the backend (once when the page loads)
fetch('http://localhost:5000/api/fooditems')
  .then(response => response.json())
  .then(data => {
    allFoodItems = data; // Store all the food items for filtering
  })
  .catch(error => {
    console.error('Error fetching food items:', error);
  });

// Display filtered food items
function displayFoodItems(items) {
  const foodItemsList = document.getElementById('foodItemsList');
  foodItemsList.innerHTML = ''; // Clear previous content

  if (items.length === 0) {
    foodItemsList.innerHTML = '<p>No items found in this category.</p>';
    return;
  }

  items.forEach(item => {
    const foodItemElement = document.createElement('li');
    foodItemElement.className = 'food-card';
    foodItemElement.innerHTML = `
      <img src="/images/${item.image}" alt="${item.name}" class="food-img">
      <div class="food-name">${item.name}</div>
      <div class="restaurant-name">${item.restaurant}</div>
      <div class="price">Rs. ${item.price}</div>
      <button onclick="addToCart('${item._id}', '${item.name}', ${item.price})">Add to Cart</button>
    `;
    foodItemsList.appendChild(foodItemElement);
  });
}

// Function to add item to cart (without login validation)
function addToCart(foodId, foodName, foodPrice) {
  // Send a POST request to add the item to the cart in the backend
  fetch('http://localhost:5000/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      foodName: foodName,    // Send the food name to be added to the cart
      foodId: foodId,        // Send the food ID to identify the item
      foodPrice: foodPrice,  // Send the price of the food item
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(`${foodName} has been added to your cart!`);
      // Update localStorage with the new cart
      updateLocalStorageCart(foodId, foodName, foodPrice);
    }
  })
  .catch(error => {
    console.error('Error adding item to cart:', error);
    alert('There was an error adding the item to your cart.');
  });
}

function updateLocalStorageCart(foodId, foodName, foodPrice) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.foodId === foodId);
  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity if item exists
  } else {
    cart.push({ foodId, foodName, foodPrice, quantity: 1 });
  }

  // Save the updated cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add click event listeners to all categories
const categories = document.querySelectorAll('.category');

categories.forEach(category => {
  category.addEventListener('click', () => {
    const selectedCategory = category.getAttribute('data-type');

    // Filter items based on the category type
    const filteredItems = allFoodItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

    // Display the filtered items
    displayFoodItems(filteredItems);
  });
});