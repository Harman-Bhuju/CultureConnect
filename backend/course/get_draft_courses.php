<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

try {
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["success" => false, "error" => "User not logged in"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get user's teacher_id
    $stmt = $conn->prepare("
        SELECT u.id, t.id as teacher_id 
        FROM users u 
        LEFT JOIN teachers t ON u.id = t.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !$user['teacher_id']) {
        echo json_encode(["success" => false, "error" => "No teacher account found"]);
        exit;
    }

    $teacher_id = $user['teacher_id'];

    // Fetch only draft courses for this teacher
    $stmt = $conn->prepare("
        SELECT 
            tc.id,
            tc.course_title as title,
            tc.category,
            tc.skill_level as level,
            tc.price,
            tc.duration_weeks,
            tc.description,
            tc.thumbnail as image,
            tc.total_videos as video_count,
            tc.status,
            tc.created_at as createdAt,
            tc.updated_at as updatedAt
        FROM teacher_courses tc
        WHERE tc.teacher_id = ? AND tc.status = 'draft'
        ORDER BY tc.updated_at DESC
    ");

    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $drafts = [];
    while ($course = $result->fetch_assoc()) {
        $duration_display = $course['duration_weeks']
            ? $course['duration_weeks'] . ' weeks'
            : 'Not set';

        $drafts[] = [
            'id' => (string)$course['id'],
            'title' => $course['title'],
            'image' => $course['image'],
            'category' => $course['category'] ? ucfirst($course['category']) : 'Uncategorized',
            'status' => 'Draft',
            'price' => (float)$course['price'],
            'createdAt' => $course['createdAt'],
            'updatedAt' => $course['updatedAt'],
            'duration' => $duration_display,
            'level' => $course['level'] ? ucfirst($course['level']) : 'Not set',
            'video_count' => (int)$course['video_count']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'drafts' => $drafts,
        'count' => count($drafts)
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
