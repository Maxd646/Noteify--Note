document.addEventListener('DOMContentLoaded', function() {
    setupForgetForm();
});

function setupForgetForm() {
    const forgetForm = document.getElementById('forgetForm');
    if (!forgetForm) return;
    
    forgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showError('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (!userExists) {
            showError('No account found with this email address');
            return;
        }
        
        showSuccess('Password reset instructions have been sent to your email');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}