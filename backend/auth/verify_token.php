<?php
/**
 * Token verification helper — included by API endpoints.
 * Reads: Authorization: Bearer <token>
 * Returns the authenticated user_id (int) or sends 401 and exits.
 */
function requireAuth($conn) {
    // getallheaders() may not exist on all server configs
    $auth = '';
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    // Fallback: read directly from $_SERVER
    if (empty($auth)) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(\S+)$/i', $auth, $m)) {
        http_response_code(401);
        echo json_encode(['error' => 'Missing or invalid Authorization header']);
        exit;
    }

    $token = $m[1];

    $stmt = $conn->prepare(
        'SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()'
    );
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$row) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired session token']);
        exit;
    }

    return (int) $row['user_id'];
}
