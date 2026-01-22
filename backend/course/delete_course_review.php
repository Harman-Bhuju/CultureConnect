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

    // Get user ID
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    // Get POST data (using JSON for consistency or POST)
    $data = json_decode(file_get_contents('php://input'), true);
    $review_id = $data['review_id'] ?? $_POST['review_id'] ?? null;

    if (!$review_id || !is_numeric($review_id)) {
        echo json_encode(["status" => "error", "message" => "Invalid review ID"]);
        exit;
    }

    // Verify ownership and get course_id
    $stmt = $conn->prepare("SELECT course_id FROM teacher_course_reviews WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->bind_param("ii", $review_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $review = $result->fetch_assoc();
    $stmt->close();

    if (!$review) {
        echo json_encode(["status" => "error", "message" => "Review not found or unauthorized"]);
        exit;
    }

    $course_id = $review['course_id'];

    // Start transaction
    $conn->begin_transaction();

    // Delete replies first if any (foreign key might handle this, but explicit is safer)
    $stmt = $conn->prepare("DELETE FROM teacher_course_review_replies WHERE review_id = ?");
    $stmt->bind_param("i", $review_id);
    $stmt->execute();
    $stmt->close();

    // Delete the review
    $stmt = $conn->prepare("DELETE FROM teacher_course_reviews WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $review_id, $user_id);
    
    if ($stmt->execute()) {
        $stmt->close();

        // Update course statistics
        $stmt = $conn->prepare("
            UPDATE teacher_courses 
            SET 
                average_rating = COALESCE((SELECT AVG(rating) FROM teacher_course_reviews WHERE course_id = ?), 0),
                total_reviews = (SELECT COUNT(*) FROM teacher_course_reviews WHERE course_id = ?)
            WHERE id = ?
        ");
        $stmt->bind_param("iii", $course_id, $course_id, $course_id);
        $stmt->execute();
        $stmt->close();

        $conn->commit();
        echo json_encode([
            "status" => "success",
            "message" => "Review deleted successfully"
        ]);
    } else {
        throw new Exception("Failed to delete review");
    }

} catch (Exception $e) {
    if (isset($conn)) $conn->rollback();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();
