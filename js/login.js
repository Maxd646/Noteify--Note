const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'main.html';
    } else {
        alert('Invalid email or password.');
    }
});
