// Forgot password — pure MySQL auth
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('forgetForm')?.addEventListener('submit', handleForgot);
});

async function handleForgot(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const data = await NoteifyAPI.forgotPassword(email);

        // In development the token is returned so you can test reset directly
        if (data.reset_token) {
            showNotification('Reset token: ' + data.reset_token, 'info');
            // Store token so reset page can pre-fill it
            localStorage.setItem('reset_token', data.reset_token);
            setTimeout(() => window.location.href = 'reset_password.html', 3000);
        } else {
            showNotification('If that email exists, a reset link has been sent.', 'success');
            setTimeout(() => window.location.href = 'login.html', 2000);
        }
    } catch (err) {
        showNotification(err.message || 'Request failed', 'error');
    } finally {
        btn.textContent = 'Send Reset Link';
        btn.disabled = false;
    }
}
