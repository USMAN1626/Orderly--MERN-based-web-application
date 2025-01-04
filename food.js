let allFoodItems = [];

// Fetch data from the backend (correct URL for port 5000)
fetch('http://localhost:5000/api/fooditems')  // Make sure this URL is correct
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    console.log('Data fetched from API:', data); // Check if data is logged
    allFoodItems = data; // Store food items globally
    displayFoodItems(allFoodItems); // Display all food items initially
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    const container = document.getElementById('foodContainer');
    container.innerHTML = '<p>Failed to load food items. Please try again later.</p>';
  });

// Function to display food items in the container
function displayFoodItems(items) {
  const container = document.getElementById('foodContainer');
  container.innerHTML = ''; // Clear previous content

  if (items.length === 0) {
    container.innerHTML = '<p>No items found in this category.</p>';
    return;
  }

  // Create cards for each food item
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="/images/${item.image}" alt="${item.name}" class="food-img">
      <h3>${item.name}</h3>
      <p>${item.restaurant}</p>
      <p class="price">Rs. ${item.price}</p>
      <button class="add-to-cart" data-id="${item._id}">Add to Cart</button>
    `;

    container.appendChild(card);
  });

  // Attach event listeners to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const foodId = event.target.getAttribute('data-id');
      addToCart(foodId); // Call the addToCart function
    });
  });
}

function addToCart(foodName) {
  const customerEmail = "ayeshamajid980@gmail.com";  // Hardcoded for now, replace with dynamic email logic

  fetch('http://localhost:5000/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ foodName, customerEmail }), // Send foodName and customerEmail to the backend
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      return response.json();
    })
    .then((data) => {
      alert('Item added to cart successfully!');
      console.log('Cart Response:', data);
    })
    .catch((error) => {
      console.error('Error adding item to cart:', error);
    });
}

// Add click event listeners to all categories
const categories = document.querySelectorAll('.category');

categories.forEach((category) => {
  category.addEventListener('click', () => {
    // Log the category clicked for debugging
    const selectedCategory = category.getAttribute('data-type');
    console.log('Category selected:', selectedCategory);

    // Filter items based on the category type
    const filteredItems = allFoodItems.filter(
      (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    console.log('Filtered items:', filteredItems);  // Log the filtered items

    // Display the filtered items
    displayFoodItems(filteredItems);
  });
});