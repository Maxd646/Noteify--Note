<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {
    setupMobileNavigation();
    setupThemeToggle();
    document.getElementById('loginForm')?.addEventListener('submit', handleEmailLogin);
});

async function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) return showNotification('Please fill in all fields', 'error');
=======
// Login — pure MySQL auth
document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupTheme();

    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
>>>>>>> 654acac9c41e5730f229189409047243c37e606b

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    try {
<<<<<<< HEAD
        const res = await fetch('/backend/auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        localStorage.setItem('noteify_token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        showNotification('Login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 1000);
    } catch (err) {
        showNotification(err.message || 'Login failed', 'error');
    } finally {
        btn.textContent = 'Sign In with Email';
=======
        await NoteifyAPI.login(email, password);
        showNotification('Login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 800);
    } catch (err) {
        showNotification(err.message || 'Login failed', 'error');
    } finally {
        btn.textContent = 'Sign In';
>>>>>>> 654acac9c41e5730f229189409047243c37e606b
        btn.disabled = false;
    }
}

<<<<<<< HEAD
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
=======
function setupTheme() {
>>>>>>> 654acac9c41e5730f229189409047243c37e606b
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
<<<<<<< HEAD
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
=======
    updateThemeIcon(theme);
    toggle.addEventListener('click', () => {
        const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        updateThemeIcon(t);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });
    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
>>>>>>> 654acac9c41e5730f229189409047243c37e606b
        }
    });
}
