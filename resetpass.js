document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/customer/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Password reset successful');
        window.location.href = 'log.html';
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred. Please try again.');
    }
  });