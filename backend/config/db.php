<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'noteify_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getConnection() {
    // Avoid uncaught mysqli_sql_exception producing an empty HTTP body.
    mysqli_report(MYSQLI_REPORT_OFF);
    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if (!$conn || $conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . ($conn->connect_error ?? 'Unknown error')]);
        flush();
        exit;
    }

    $conn->set_charset(DB_CHARSET);
    return $conn;
}
