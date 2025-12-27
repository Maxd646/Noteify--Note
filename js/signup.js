// Simple Signup System
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('An account with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(), // Simple ID generation
        name: name,
        email: email,
        password: password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    // Add user to array and save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! You can now login.');
    window.location.href = 'login.html';
});