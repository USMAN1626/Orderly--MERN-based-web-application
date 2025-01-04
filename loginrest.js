document.getElementById('restaurantLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: document.getElementById('email').value,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/restaurant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('restaurantId', result.restaurantId);
        localStorage.setItem('restaurantEmail', loginData.email);
        window.location.href = 'index.html'; 
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    }
  });
  