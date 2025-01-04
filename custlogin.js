document.getElementById('customer-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  try {
    const response = await fetch('http://localhost:5000/api/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Login successful!');
      localStorage.setItem('customerId', result.customerId);
      localStorage.setItem('email', loginData.email);
      window.location.href = 'cart.html';
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('An error occurred. Please try again.');
  }
});

document.getElementById('forgot-password-link').addEventListener('click', () => {
  document.getElementById('customer-login-form').style.display = 'none';
  document.getElementById('forgot-password-form').style.display = 'block';
});

document.getElementById('back-to-login').addEventListener('click', () => {
  document.getElementById('forgot-password-form').style.display = 'none';
  document.getElementById('customer-login-form').style.display = 'block';
});

document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('reset-email').value;

  try {
    const response = await fetch('http://localhost:5000/api/customer/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Password reset link sent to your email');
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('Error requesting password reset:', error);
    alert('An error occurred. Please try again.');
  }
});