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
$completed = $data['completed'] ?? false;

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

    if ($completed) {
        $stmt = $conn->prepare("INSERT INTO student_course_progress (user_id, course_id, video_id, completed_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE completed_at = NOW()");
        $stmt->bind_param("iii", $user_id, $course_id, $video_id);
    } else {
        // Reset timestamp and remove completion status
        $stmt = $conn->prepare("UPDATE student_course_progress SET completed_at = NULL, last_watched_timestamp = 0 WHERE user_id = ? AND course_id = ? AND video_id = ?");
        $stmt->bind_param("iii", $user_id, $course_id, $video_id);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "completed" => $completed]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
