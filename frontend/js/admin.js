const ADMIN_API = '/Noteify--Note/backend/admin';

// ── Auth guard ────────────────────────────────────────────────────────────────
const token = localStorage.getItem('noteify_token');
const user  = JSON.parse(localStorage.getItem('currentUser') || 'null');

if (!token || !user) {
    location.href = 'login.html';
}

document.getElementById('adminName').textContent = user?.name || '';

// ── Navigation ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item[data-section]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const sec = link.dataset.section;
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
        document.getElementById('section-' + sec).classList.remove('hidden');
        if (sec === 'users') loadUsers();
    });
});

// ── API helpe
/* ========================
   Delete User
======================== */
function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    loadDashboard();
}

/* ========================
   Logout
======================== */
function logout() {
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}

document.getElementById("logoutBtn").onclick = logout;
document.getElementById("logoutTop").onclick = logout;

/* ========================
   Protect Page (Frontend)
======================== */
const role = localStorage.getItem("userRole");

if (role !== "admin") {
    window.location.href = "index.html";
}

/* Init */
loadDashboard();