document.getElementById('restaurantSignupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const foodItem = {
      name: document.getElementById('name').value,
      category: document.getElementById('category').value,
      price: document.getElementById('price').value,
      restaurant: document.getElementById('restaurant').value,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/fooditems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodItem),
      });
  
      if (response.ok) {
        alert('Food item added successfully!');
        window.location.href = 'index.html'; // Redirect to the main page or another page
      } else {
        alert('Error adding food item. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });