<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../auth/verify_token.php';

$conn = getConnection();
$user_id = requireAuth($conn);

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

$result = $conn->query(
    'SELECT u.id, u.name, u.email, u.role, u.created_at,
            COUNT(n.id) AS note_count
     FROM users u
     LEFT JOIN notes n ON n.user_id = u.id
     GROUP BY u.id ORDER BY u.created_at DESC'
);

$users = [];
while ($r = $result->fetch_assoc()) {
    $r['note_count'] = (int)$r['note_count'];
    $users[] = $r;
}
$conn->close();
echo json_encode(['success' => true, 'users' => $users]);
