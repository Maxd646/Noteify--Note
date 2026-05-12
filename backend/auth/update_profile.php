<?php
require_once '../config/cors.php';
require_once '../config/db.php';
require_once '../auth/verify_token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$conn    = getConnection();
$user_id = requireAuth($conn);

$fields = [];
$params = [];
$types  = '';

if (!empty($_POST['name'])) {
    $name = trim($_POST['name']);
    if (strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['error' => 'Name must be at least 2 characters']);
        exit;
    }
    $fields[] = 'name = ?';
    $params[] = $name;
    $types   .= 's';
}

if (!empty($_POST['email'])) {
    $email = trim($_POST['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    $chk = $conn->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $chk->bind_param('si', $email, $user_id);
    $chk->execute();
    $chk->store_result();
    if ($chk->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already in use']);
        $chk->close();
        $conn->close();
        exit;
    }
    $chk->close();
    $fields[] = 'email = ?';
    $params[] = $email;
    $types   .= 's';
}

if (!empty($_POST['password'])) {
    $pw = $_POST['password'];
    if (strlen($pw) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        exit;
    }
    $fields[] = 'password = ?';
    $params[] = password_hash($pw, PASSWORD_BCRYPT);
    $types   .= 's';
}

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['avatar'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 2 * 1024 * 1024;

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, WEBP allowed']);
        exit;
    }

    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File size exceeds 2MB limit']);
        exit;
    }

    $uploadDir = __DIR__ . '/../../uploads/avatars/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeFilename = uniqid('avatar_', true) . '.' . $ext;
    $uploadPath = $uploadDir . $safeFilename;

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload avatar']);
        exit;
    }

    $avatarUrl = '/uploads/avatars/' . $safeFilename;
    $fields[] = 'avatar = ?';
    $params[] = $avatarUrl;
    $types   .= 's';
}

if (empty($fields)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nothing to update']);
    exit;
}

$params[] = $user_id;
$types   .= 'i';

$sql  = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

$stmt = $conn->prepare('SELECT id, name, email, avatar FROM users WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'user' => $user]);
