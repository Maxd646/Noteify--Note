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

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    try {
        await NoteifyAPI.login(email, password);
        showNotification('Login successful!', 'success');
        setTimeout(() => window.location.href = 'main.html', 800);
    } catch (err) {
        showNotification(err.message || 'Login failed', 'error');
    } finally {
        btn.textContent = 'Sign In';
        btn.disabled = false;
    }
}

function setupTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
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
        }
    });
}
