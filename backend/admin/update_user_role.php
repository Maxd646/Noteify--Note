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

$data = json_decode(file_get_contents('php://input'), true);
$target_id = intval($data['id'] ?? 0);
$role = $data['role'] ?? '';

if (!$target_id || !in_array($role, ['user', 'admin'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid id or role']);
    exit;
}

$stmt = $conn->prepare('UPDATE users SET role = ? WHERE id = ?');
$stmt->bind_param('si', $role, $target_id);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['success' => true]);
