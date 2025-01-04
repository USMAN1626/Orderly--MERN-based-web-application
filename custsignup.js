document.getElementById('customer-signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value.trim(),
  };

  try {
      const response = await fetch('http://localhost:5000/api/customer/signup', { // Ensure the URL is correct
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
          alert('Customer registered successfully!');
      } else {
          console.error('Signup Error:', result);
          alert(`Error: ${result.message}`);
      }
  } catch (error) {
      console.error('Error registering customer:', error);
      alert('An error occurred. Please try again.');
  }
});
