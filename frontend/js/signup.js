// Signup — pure MySQL auth
document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupTheme();

    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
});

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();

    if (!name || !email || !password || !confirm) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
        await NoteifyAPI.register(name, email, password);
        showNotification('Account created!', 'success');
        setTimeout(() => window.location.href = 'main.html', 800);
    } catch (err) {
        showNotification(err.message || 'Registration failed', 'error');
    } finally {
        btn.textContent = 'Create Account';
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
