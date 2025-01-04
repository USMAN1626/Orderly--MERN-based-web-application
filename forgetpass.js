// Handling the "Forgot Password" link click
document.getElementById("forgot-password-link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevents the link from navigating
    document.getElementById("customer-login-section").style.display = "none"; // Hide login form
    document.getElementById("forgot-password-form").style.display = "block"; // Show reset form
});

// Handling the "Back to Login" button click
document.getElementById("back-to-login").addEventListener("click", function() {
    document.getElementById("customer-login-section").style.display = "block"; // Show login form
    document.getElementById("forgot-password-form").style.display = "none"; // Hide reset form
});

// Handling the reset password form submission
document.getElementById("reset-password-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    const email = document.getElementById("reset-email").value;
    
    // Simulating the password reset action (you should replace this with an actual API call)
    alert(`A password reset link has been sent to ${email}`);
    
    // Optionally, reset the form
    document.getElementById("reset-password-form").reset();
});
