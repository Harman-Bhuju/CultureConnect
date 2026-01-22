<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

try {
    // Check authentication
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "Not authenticated"]);
        exit;
    }

    $user_email = $_SESSION['user_email'];

    // Get teacher ID
    $stmt = $conn->prepare("
        SELECT t.id 
        FROM teachers t 
        JOIN users u ON t.user_id = u.id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $teacher = $result->fetch_assoc();
    $stmt->close();

    if (!$teacher) {
        echo json_encode(["status" => "error", "message" => "Teacher account not found"]);
        exit;
    }

    $teacher_id = $teacher['id'];

    // Get POST data
    $review_id = $_POST['review_id'] ?? null;
    $reply_text = $_POST['reply_text'] ?? null;
    $reply_id = $_POST['reply_id'] ?? null; // For editing

    if (!$review_id || !is_numeric($review_id)) {
        echo json_encode(["status" => "error", "message" => "Invalid review ID"]);
        exit;
    }

    $reply_text = trim($reply_text);
    if (strlen($reply_text) < 10) {
        echo json_encode(["status" => "error", "message" => "Reply must be at least 10 characters"]);
        exit;
    }

    // Verify review belongs to one of this teacher's courses
    $stmt = $conn->prepare("
        SELECT tcr.id 
        FROM teacher_course_reviews tcr
        JOIN teacher_courses tc ON tcr.course_id = tc.id
        WHERE tcr.id = ? AND tc.teacher_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("ii", $review_id, $teacher_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Review not found or unauthorized"]);
        exit;
    }
    $stmt->close();

    if ($reply_id) {
        // Update existing reply
        $stmt = $conn->prepare("UPDATE teacher_course_review_replies SET reply_text = ?, updated_at = NOW() WHERE id = ? AND teacher_id = ?");
        $stmt->bind_param("sii", $reply_text, $reply_id, $teacher_id);
    } else {
        // Insert new reply
        // Check if already replied
        $stmt = $conn->prepare("SELECT id FROM teacher_course_review_replies WHERE review_id = ? LIMIT 1");
        $stmt->bind_param("i", $review_id);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "You have already replied to this review"]);
            exit;
        }
        $stmt->close();

        $stmt = $conn->prepare("INSERT INTO teacher_course_review_replies (review_id, teacher_id, reply_text, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("iis", $review_id, $teacher_id, $reply_text);
    }

    if ($stmt->execute()) {
        $last_id = $reply_id ?: $conn->insert_id;
        $stmt->close();

        // Get updated reply info
        $stmt = $conn->prepare("
            SELECT tcrr.*, t.teacher_name, t.profile_picture 
            FROM teacher_course_review_replies tcrr
            JOIN teachers t ON tcrr.teacher_id = t.id
            WHERE tcrr.id = ?
        ");
        $stmt->bind_param("i", $last_id);
        $stmt->execute();
        $reply = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        echo json_encode([
            "status" => "success",
            "message" => "Reply saved successfully",
            "reply" => [
                'id' => (int)$reply['id'],
                'teacherId' => $teacher_id,
                'replyText' => $reply['reply_text'],
                'teacherName' => $reply['teacher_name'],
                'teacherImage' => $reply['profile_picture'],
                'createdAt' => $reply['created_at'],
                'updatedAt' => $reply['updated_at']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save reply"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
