<?php
// One-time database setup — run once then delete this file
header('Content-Type: text/plain');

require_once 'config/db.php';

// Connect without selecting a database first
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$queries = [
    "CREATE DATABASE IF NOT EXISTS noteify_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "USE noteify_db",
    "CREATE TABLE IF NOT EXISTS users (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('user','admin') NOT NULL DEFAULT 'user',
        avatar     MEDIUMTEXT   DEFAULT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    "CREATE TABLE IF NOT EXISTS sessions (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id    INT UNSIGNED NOT NULL,
        token      VARCHAR(64)  NOT NULL UNIQUE,
        expires_at DATETIME     NOT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    "CREATE TABLE IF NOT EXISTS notes (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id    INT UNSIGNED NOT NULL,
        title      VARCHAR(255) NOT NULL,
        body       TEXT         NOT NULL,
        tags       JSON         NOT NULL DEFAULT ('[]'),
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    "CREATE TABLE IF NOT EXISTS password_resets (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email      VARCHAR(255) NOT NULL,
        token      VARCHAR(64)  NOT NULL UNIQUE,
        expires_at DATETIME     NOT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

foreach ($queries as $sql) {
    if ($conn->query($sql) === true) {
        echo "OK: " . substr($sql, 0, 60) . "...\n";
    } else {
        echo "ERROR: " . $conn->error . "\n";
    }
}

$conn->close();
echo "\nDone! Database and tables created. DELETE this file now.\n";
echo "\nRunning migrations for existing installs...\n";

// Re-connect to noteify_db for migrations
$conn2 = new mysqli(DB_HOST, DB_USER, DB_PASS, 'noteify_db');
$migrations = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user','admin') NOT NULL DEFAULT 'user'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar MEDIUMTEXT DEFAULT NULL",
];
foreach ($migrations as $sql) {
    if ($conn2->query($sql) === true) {
        echo "Migration OK: " . substr($sql, 0, 60) . "...\n";
    } else {
        echo "Migration skipped (already exists): " . $conn2->error . "\n";
    }
}
$conn2->close();
echo "\nAll done! DELETE this file now.\n";
