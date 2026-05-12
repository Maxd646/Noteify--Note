document.addEventListener('DOMContentLoaded', function () {
    setupMobileNavigation();
    setupThemeToggle();
    document.getElementById('signupForm')?.addEventListener('submit', handleEmailSignup);
});

async function handleEmailSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();

    if (!name || !email || !password || !confirm) return showNotification('Please fill in all fields', 'error');
    if (password !== confirm) return showNotification('Passwords do not match', 'error');
    if (password.length < 6) return showNotification('Password must be at least 6 characters', 'error');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Creating Account...';
    btn.disabled = true;

    try {
        const res = await fetch('/backend/auth/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        localStorage.setItem('noteify_token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        showNotification('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (err) {
        showNotification(err.message || 'Registration failed', 'error');
    } finally {
        btn.textContent = 'Create Account';
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

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    toggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.querySelector('.theme-icon').textContent = next === 'dark' ? '☀️' : '🌙';
    });
}

function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}
