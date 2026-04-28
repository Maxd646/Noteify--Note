

/* ========================
   Load Dashboard
======================== */
function loadDashboard() {
    document.getElementById("userCount").innerText = users.length;
    document.getElementById("noteCount").innerText = notes.length;

    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(user => {
        table.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

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