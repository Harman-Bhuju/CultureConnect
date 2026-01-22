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

    // Get data
    $data = json_decode(file_get_contents('php://input'), true);
    $reply_id = $data['reply_id'] ?? $_POST['reply_id'] ?? null;

    if (!$reply_id || !is_numeric($reply_id)) {
        echo json_encode(["status" => "error", "message" => "Invalid reply ID"]);
        exit;
    }

    // Delete reply
    $stmt = $conn->prepare("DELETE FROM teacher_course_review_replies WHERE id = ? AND teacher_id = ?");
    $stmt->bind_param("ii", $reply_id, $teacher_id);

    if ($stmt->execute()) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Reply deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Reply not found or unauthorized"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete reply"]);
    }
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
