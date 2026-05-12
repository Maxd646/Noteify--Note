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

if (!$target_id || $target_id === $user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid user id or cannot delete yourself']);
    exit;
}

$stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
$stmt->bind_param('i', $target_id);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode(['success' => true]);
