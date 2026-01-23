<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "Not authenticated"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$course_id = $data['course_id'] ?? null;
$video_id = $data['video_id'] ?? null;
$timestamp = $data['timestamp'] ?? 0;

if (!$course_id || !$video_id) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

try {
    $user_email = $_SESSION['user_email'];
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $user_id = $stmt->get_result()->fetch_assoc()['id'];
    $stmt->close();

    // Insert or update timestamp
    // We do NOT touch completed_at here. If it's NULL, it stays NULL (in progress). If it's set, it stays set.
    $stmt = $conn->prepare("
        INSERT INTO student_course_progress (user_id, course_id, video_id, last_watched_timestamp, completed_at) 
        VALUES (?, ?, ?, ?, NULL) 
        ON DUPLICATE KEY UPDATE last_watched_timestamp = ?
    ");
    // Note: On insert, completed_at is NULL. On update, we only change timestamp.
    $stmt->bind_param("iiiid", $user_id, $course_id, $video_id, $timestamp, $timestamp);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        throw new Exception($stmt->error);
    }
    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
