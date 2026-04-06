// Auth utilities — no Firebase

function getCurrentUser() {
    try {
        const u = localStorage.getItem('currentUser');
        return u ? JSON.parse(u) : null;
    } catch { return null; }
}

function isLoggedIn() {
    return !!getCurrentUser() && !!localStorage.getItem('noteify_token');
}

function updateNavigationForAuth() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        navLinks.innerHTML = `
            <a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a>
            <a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a>
            <a href="main.html"  ${currentPage === 'main.html' ? 'class="active"' : ''}>My Notes</a>
            <div class="user-menu">
                <button class="user-menu-btn">Hi, ${user.name} ▼</button>
                <div class="user-dropdown">
                    <a href="main.html">My Notes</a>
                    <a href="#" onclick="authLogout()">Logout</a>
                </div>
            </div>`;
        setupUserMenuEvents();
    } else {
        navLinks.innerHTML = `
            <a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a>
            <a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a>
            <a href="login.html" ${currentPage === 'login.html' ? 'class="active"' : ''}>Login</a>
            <a href="signup.html" ${currentPage === 'signup.html' ? 'class="active"' : ''}>Sign Up</a>`;
    }
}

function setupUserMenuEvents() {
    const btn = document.querySelector('.user-menu-btn');
    const dropdown = document.querySelector('.user-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => { dropdown.style.display = 'none'; });
}

async function authLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    if (window.NoteifyAPI) await window.NoteifyAPI.logout();
    else { localStorage.removeItem('noteify_token'); localStorage.removeItem('currentUser'); }
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 800);
}

function redirectIfLoggedIn() {
    const page = window.location.pathname.split('/').pop();
    if (isLoggedIn() && (page === 'login.html' || page === 'signup.html')) {
        window.location.href = 'main.html';
    }
}

function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 20px;
        border-radius:8px;color:white;font-weight:500;z-index:10000;
        max-width:300px;box-shadow:0 4px 12px rgba(0,0,0,.15);
        transform:translateX(100%);transition:transform .3s ease;`;
    const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
    n.style.backgroundColor = colors[type] || colors.info;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 50);
    setTimeout(() => { n.style.transform = 'translateX(100%)'; setTimeout(() => n.remove(), 300); }, 3000);
}

window.updateNavigationForAuth = updateNavigationForAuth;
window.authLogout = authLogout;
window.showNotification = showNotification;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;

document.addEventListener('DOMContentLoaded', () => {
    updateNavigationForAuth();
    redirectIfLoggedIn();
});
