<?php
// Suppress HTML error output so responses are always valid JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);

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
