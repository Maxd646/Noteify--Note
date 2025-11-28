const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if(password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if(users.find(u => u.email === email)) {
        alert("User already exists!");
        return;
    }

    users.push({name, email, password});
    localStorage.setItem('users', JSON.stringify(users));
    alert("Sign up successful! You can now login.");
    window.location.href = 'login.html';
});
