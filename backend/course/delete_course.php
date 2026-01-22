<?php
require_once __DIR__ . '/../config/session_config.php';
include(__DIR__ . "/../config/header.php");

function sendResponse($status, $message, $data = null)
{
    $response = [
        "status" => $status,
        "message" => $message
    ];
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse("error", "Invalid request method");
}

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    sendResponse("error", "User not logged in");
}

$user_email = $_SESSION['user_email'];
$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : null;

if (!$course_id) {
    sendResponse("error", "Course ID is required");
}

// Fetch user and teacher info
$stmt = $conn->prepare("SELECT u.id, t.id as teacher_id FROM users u LEFT JOIN teachers t ON u.id = t.user_id WHERE u.email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !$user['teacher_id']) {
    sendResponse("error", "No teacher account found");
}

$teacher_id = $user['teacher_id'];

// Verify course belongs to this teacher
$verify_stmt = $conn->prepare("SELECT id, thumbnail FROM teacher_courses WHERE id = ? AND teacher_id = ? LIMIT 1");
$verify_stmt->bind_param("ii", $course_id, $teacher_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();
$existing_course = $verify_result->fetch_assoc();
$verify_stmt->close();

if (!$existing_course) {
    sendResponse("error", "Course not found or you don't have permission to delete it");
}

$conn->begin_transaction();

try {
    // Get all videos for this course to delete files
    $vid_stmt = $conn->prepare("SELECT video_filename, thumbnail FROM teacher_videos WHERE course_id = ?");
    $vid_stmt->bind_param("i", $course_id);
    $vid_stmt->execute();
    $vid_result = $vid_stmt->get_result();

    $videoUploadDir = dirname(__DIR__) . '/uploads/teacher_datas/course_videos/';
    $thumbnailUploadDir = dirname(__DIR__) . '/uploads/teacher_datas/course_thumbnails/';

    // Delete video files from system
    while ($row = $vid_result->fetch_assoc()) {
        if ($row['video_filename'] && file_exists($videoUploadDir . $row['video_filename'])) {
            unlink($videoUploadDir . $row['video_filename']);
        }
        // We do not delete thumbnail here if we want to keep the course visible in analytics, 
        // but user asked to "delete video from system". keeping course thumbnail is usually fine for history.
        // However, if we delete video rows, we should decide about thumbnails.
        // Let's assume we keep course thumbnail but delete video thumbnails.
        if ($row['thumbnail'] && file_exists($thumbnailUploadDir . $row['thumbnail'])) {
            unlink($thumbnailUploadDir . $row['thumbnail']);
        }
    }
    $vid_stmt->close();

    // Confirm video deletion
    $del_vids = $conn->prepare("DELETE FROM teacher_videos WHERE course_id = ?");
    $del_vids->bind_param("i", $course_id);
    $del_vids->execute();
    $del_vids->close();

    // Delete Course Thumbnail if exists
    if ($existing_course['thumbnail'] && file_exists($thumbnailUploadDir . $existing_course['thumbnail'])) {
        unlink($thumbnailUploadDir . $existing_course['thumbnail']);
    }

    // Soft delete the course - Update status to 'deleted', total_videos = 0, thumbnail = NULL (since deleted)
    // We KEEP tags and course record
    $update_course = $conn->prepare("UPDATE teacher_courses SET status = 'deleted', total_videos = 0, thumbnail = NULL WHERE id = ?");
    $update_course->bind_param("i", $course_id);
    $update_course->execute();
    $update_course->close();

    $conn->commit();

    sendResponse("success", "Course deleted successfully (Soft deleted, videos removed)");
} catch (Exception $e) {
    $conn->rollback();
    sendResponse("error", "Failed to delete course: " . $e->getMessage());
}

$conn->close();
