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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse("error", "Invalid request method");
}

// Check if user is logged in
if (!isset($_SESSION['user_email'])) {
    sendResponse("error", "User not logged in");
}

$user_email = $_SESSION['user_email'];

// Get course_id from POST
$course_id = isset($_POST['course_id']) ? intval($_POST['course_id']) : null;
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
    sendResponse("error", "Course not found or you don't have permission to edit it");
}

// Get form data
$course_title = trim($_POST['courseTitle'] ?? '');
$category = trim($_POST['category'] ?? '');
$skill_level = trim($_POST['skillLevel'] ?? '');
$price = trim($_POST['price'] ?? '0');
$duration_weeks = trim($_POST['durationWeeks'] ?? '');
$hours_per_week = trim($_POST['hoursPerWeek'] ?? '');
$learning_schedule = trim($_POST['learningSchedule'] ?? '');
$description = trim($_POST['description'] ?? '');
$what_you_will_learn = trim($_POST['whatYouWillLearn'] ?? '');
$requirements = trim($_POST['requirements'] ?? '');
$language = trim($_POST['language'] ?? 'English');
$status = trim($_POST['status'] ?? 'draft');

// Validate required fields
if (empty($course_title) || strlen($course_title) < 3) {
    sendResponse("error", "Course title must be at least 3 characters");
}

$price = floatval($price);
if ($price < 0 || $price > 999999999) {
    sendResponse("error", "Invalid price value");
}

$duration_weeks = intval($duration_weeks);
if ($duration_weeks < 1 || $duration_weeks > 52) {
    sendResponse("error", "Duration must be between 1 and 52 weeks");
}

if (!in_array($status, ['draft', 'published'])) {
    sendResponse("error", "Invalid status");
}

// Get tags
$tags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];

// Handle course thumbnail
$thumbnailUploadDir = dirname(__DIR__) . '/uploads/teacher_datas/course_thumbnails/';
$courseThumbnailName = $existing_course['thumbnail'];

if (isset($_FILES['course_thumbnail']) && $_FILES['course_thumbnail']['error'] === 0) {
    $allowedImageExts = ['jpg', 'jpeg', 'png', 'webp'];
    $maxImageSize = 5 * 1024 * 1024; // 5MB

    $ctmp = $_FILES['course_thumbnail']['tmp_name'];
    $ctsize = $_FILES['course_thumbnail']['size'];
    $ctname = $_FILES['course_thumbnail']['name'];
    $ctext = strtolower(pathinfo($ctname, PATHINFO_EXTENSION));

    if (!in_array($ctext, $allowedImageExts)) {
        sendResponse("error", "Invalid course thumbnail type. JPG/PNG/WEBP allowed");
    }

    if ($ctsize > $maxImageSize) {
        sendResponse("error", "Course thumbnail too large. Max 5MB");
    }

    $newThumbName = 'course_thumb_' . $teacher_id . '_' . bin2hex(random_bytes(8)) . '.' . $ctext;

    if (move_uploaded_file($ctmp, $thumbnailUploadDir . $newThumbName)) {
        // Delete old thumbnail
        if ($courseThumbnailName && file_exists($thumbnailUploadDir . $courseThumbnailName)) {
            unlink($thumbnailUploadDir . $courseThumbnailName);
        }
        $courseThumbnailName = $newThumbName;
    }
}

// Start transaction
$conn->begin_transaction();

try {
    // Update course record
    $update_query = "UPDATE teacher_courses SET 
        course_title = ?, 
        category = ?, 
        skill_level = ?, 
        price = ?, 
        duration_weeks = ?, 
        hours_per_week = ?, 
        description = ?, 
        what_you_will_learn = ?, 
        requirements = ?, 
        learning_schedule = ?, 
        language = ?, 
        status = ?, 
        thumbnail = ?
        WHERE id = ? AND teacher_id = ?";

    $stmt = $conn->prepare($update_query);
    $stmt->bind_param(
        "sssdiisssssssii",
        $course_title,
        $category,
        $skill_level,
        $price,
        $duration_weeks,
        $hours_per_week,
        $description,
        $what_you_will_learn,
        $requirements, // Changed from $requirements_value
        $learning_schedule,
        $language,
        $status,
        $courseThumbnailName, // Changed from $thumbnail_to_save
        $course_id,
        $teacher_id
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update course: " . $stmt->error);
    }
    $stmt->close();

    // Update tags: delete existing and insert new
    $delete_tags_stmt = $conn->prepare("DELETE FROM teacher_course_tags WHERE course_id = ?");
    $delete_tags_stmt->bind_param("i", $course_id);
    $delete_tags_stmt->execute();
    $delete_tags_stmt->close();

    if (!empty($tags)) {
        $insert_tag_stmt = $conn->prepare("INSERT INTO teacher_course_tags (course_id, tag) VALUES (?, ?)");
        foreach ($tags as $tag) {
            $tag = trim($tag);
            if (!empty($tag) && strlen($tag) <= 50) {
                $insert_tag_stmt->bind_param("is", $course_id, $tag);
                $insert_tag_stmt->execute();
            }
        }
        $insert_tag_stmt->close();
    }

    // Handle deleted videos
    $deleted_video_ids = isset($_POST['deleted_video_ids']) ? json_decode($_POST['deleted_video_ids'], true) : [];
    if (!empty($deleted_video_ids)) {
        $videoUploadDir = dirname(__DIR__) . '/uploads/teacher_datas/course_videos/';

        foreach ($deleted_video_ids as $vid_id) {
            // Get filename before deleting
            $get_vid = $conn->prepare("SELECT video_filename, thumbnail FROM teacher_videos WHERE id = ? AND course_id = ?");
            $get_vid->bind_param("ii", $vid_id, $course_id);
            $get_vid->execute();
            $vid_result = $get_vid->get_result();
            $vid_row = $vid_result->fetch_assoc();
            $get_vid->close();

            if ($vid_row) {
                // Delete video file
                if ($vid_row['video_filename'] && file_exists($videoUploadDir . $vid_row['video_filename'])) {
                    unlink($videoUploadDir . $vid_row['video_filename']);
                }
                // Delete thumbnail
                if ($vid_row['thumbnail'] && file_exists($thumbnailUploadDir . $vid_row['thumbnail'])) {
                    unlink($thumbnailUploadDir . $vid_row['thumbnail']);
                }
            }

            // Delete from database
            $del_vid = $conn->prepare("DELETE FROM teacher_videos WHERE id = ? AND course_id = ?");
            $del_vid->bind_param("ii", $vid_id, $course_id);
            $del_vid->execute();
            $del_vid->close();
        }
    }

    // Update existing video metadata (titles, descriptions, durations)
    $video_ids = isset($_POST['video_ids']) ? $_POST['video_ids'] : [];
    $video_titles = isset($_POST['video_titles']) ? $_POST['video_titles'] : [];
    $video_descriptions = isset($_POST['video_descriptions']) ? $_POST['video_descriptions'] : [];
    $video_durations = isset($_POST['video_durations']) ? $_POST['video_durations'] : [];

    foreach ($video_ids as $i => $vid_id) {
        if (!empty($vid_id)) {
            $title = isset($video_titles[$i]) ? trim($video_titles[$i]) : '';
            $desc = isset($video_descriptions[$i]) ? trim($video_descriptions[$i]) : '';
            $duration = isset($video_durations[$i]) ? intval($video_durations[$i]) : 0;

            $update_vid = $conn->prepare("UPDATE teacher_videos SET video_title = ?, video_description = ?, duration = ? WHERE id = ? AND course_id = ?");
            $update_vid->bind_param("ssiii", $title, $desc, $duration, $vid_id, $course_id);
            $update_vid->execute();
            $update_vid->close();
        }
    }

    // Update total_videos count
    $count_stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM teacher_videos WHERE course_id = ?");
    $count_stmt->bind_param("i", $course_id);
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $count_row = $count_result->fetch_assoc();
    $video_count = (int)$count_row['cnt'];
    $count_stmt->close();

    $update_count = $conn->prepare("UPDATE teacher_courses SET total_videos = ? WHERE id = ?");
    $update_count->bind_param("ii", $video_count, $course_id);
    $update_count->execute();
    $update_count->close();

    $conn->commit();

    // Update teacher's total_courses count
    $update_teacher = $conn->prepare("UPDATE teachers SET total_courses = (SELECT COUNT(*) FROM teacher_courses WHERE teacher_id = ? AND status = 'published') WHERE id = ?");
    $update_teacher->bind_param("ii", $teacher_id, $teacher_id);
    $update_teacher->execute();
    $update_teacher->close();

    sendResponse(
        "success",
        $status === 'published' ? "Course published successfully" : "Course updated successfully",
        ["course_id" => $course_id]
    );
} catch (Exception $e) {
    $conn->rollback();
    sendResponse("error", "Failed to update course: " . $e->getMessage());
}

$conn->close();
