<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "Not authenticated"]);
    exit;
}

$course_id = $_GET['course_id'] ?? null;

if (!$course_id) {
    echo json_encode(["status" => "error", "message" => "Course ID required"]);
    exit;
}

try {
    $user_email = $_SESSION['user_email'];
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $user_id = $stmt->get_result()->fetch_assoc()['id'];

    $stmt = $conn->prepare("SELECT video_id FROM student_course_progress WHERE user_id = ? AND course_id = ?");
    $stmt->bind_param("ii", $user_id, $course_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $completed_videos = [];
    while ($row = $result->fetch_assoc()) {
        $completed_videos[] = (int)$row['video_id'];
    }

    echo json_encode(["status" => "success", "completed_videos" => $completed_videos]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
