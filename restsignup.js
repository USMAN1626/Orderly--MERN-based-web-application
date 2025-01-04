document.getElementById('restaurantSignupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phoneNumber').value,
      restaurantName: document.getElementById('restaurantName').value,
      restaurantUrl: document.getElementById('restaurantUrl').value,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/restaurant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Restaurant registered successfully!');
        window.location.href = 'index.html'; // Redirect to the login page or another page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error registering restaurant:', error);
      alert('An error occurred. Please try again.');
    }
  });