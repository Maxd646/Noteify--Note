<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../auth/verify_token.php';

$conn = getConnection();
$user_id = requireAuth($conn);

// Only admins
$stmt = $conn->prepare('SELECT role FROM users WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$row || $row['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$total_users = $conn->query('SELECT COUNT(*) AS c FROM users')->fetch_assoc()['c'];
$total_notes = $conn->query('SELECT COUNT(*) AS c FROM notes')->fetch_assoc()['c'];
$total_sessions = $conn->query('SELECT COUNT(*) AS c FROM sessions WHERE expires_at > NOW()')->fetch_assoc()['c'];
$new_users_today = $conn->query("SELECT COUNT(*) AS c FROM users WHERE DATE(created_at) = CURDATE()")->fetch_assoc()['c'];

$conn->close();
echo json_encode([
    'success' => true,
    'stats' => [
        'total_users'    => (int)$total_users,
        'total_notes'    => (int)$total_notes,
        'active_sessions'=> (int)$total_sessions,
        'new_users_today'=> (int)$new_users_today,
    ]
]);
