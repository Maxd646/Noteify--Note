document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('forgetForm')?.addEventListener('submit', handlePasswordReset);
});

async function handlePasswordReset(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (!email) return showNotification('Please enter your email address', 'error');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch('/backend/auth/forgot_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        showNotification('Reset token generated. Check with your admin.', 'success');
        setTimeout(() => window.location.href = 'login.html', 2000);
    } catch (err) {
        showNotification(err.message || 'Failed to send reset request', 'error');
    } finally {
        btn.textContent = 'Send Reset Link';
        btn.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:8px;color:white;font-weight:500;z-index:10000;max-width:300px;box-shadow:0 4px 12px rgba(0,0,0,0.15);transform:translateX(100%);transition:transform 0.3s ease;`;
    const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
    n.style.backgroundColor = colors[type] || colors.info;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 100);
    setTimeout(() => { n.style.transform = 'translateX(100%)'; setTimeout(() => n.remove(), 300); }, 3000);
}
