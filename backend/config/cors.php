<?php
// Suppress HTML error output so responses are always valid JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

// Convert PHP warnings/notices into exceptions so API always returns JSON.
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Last-resort JSON error response for uncaught exceptions/fatals.
set_exception_handler(function ($e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
    exit;
});

// CORS + JSON headers for all API responses
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight — must respond with 200 and empty body
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo '{}';
    exit;
}
