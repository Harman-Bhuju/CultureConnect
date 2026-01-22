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

    // Get POST data
    $course_id = $_POST['course_id'] ?? null;
    $rating = $_POST['rating'] ?? null;
    $comment = $_POST['comment'] ?? null;
    $review_id = $_POST['review_id'] ?? null; // For editing

    // Validation
    if (!$course_id || !is_numeric($course_id)) {
        echo json_encode(["status" => "error", "message" => "Invalid course ID"]);
        exit;
    }

    if (!$rating || !is_numeric($rating) || $rating < 1 || $rating > 5) {
        echo json_encode(["status" => "error", "message" => "Rating must be between 1 and 5"]);
        exit;
    }

    $comment = trim($comment);
    if (strlen($comment) < 10) {
        echo json_encode(["status" => "error", "message" => "Review must be at least 10 characters"]);
        exit;
    }

    if (strlen($comment) > 500) {
        echo json_encode(["status" => "error", "message" => "Review cannot exceed 500 characters"]);
        exit;
    }

    // Check if course exists
    $stmt = $conn->prepare("SELECT id FROM teacher_courses WHERE id = ? AND status = 'published' LIMIT 1");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Published course not found"]);
        exit;
    }
    $stmt->close();

    // Check if user is enrolled
    $stmt = $conn->prepare("SELECT id FROM teacher_course_enroll WHERE course_id = ? AND student_id = ? AND payment_status IN ('paid', 'free') LIMIT 1");
    $stmt->bind_param("ii", $course_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Only enrolled students can review this course"]);
        exit;
    }
    $stmt->close();

    // Start transaction
    $conn->begin_transaction();

    if ($review_id) {
        // UPDATE existing review
        $stmt = $conn->prepare("SELECT id FROM teacher_course_reviews WHERE id = ? AND user_id = ? LIMIT 1");
        $stmt->bind_param("ii", $review_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(["status" => "error", "message" => "Review not found or unauthorized"]);
            $conn->rollback();
            exit;
        }
        $stmt->close();

        $stmt = $conn->prepare("
            UPDATE teacher_course_reviews 
            SET rating = ?, comment = ?, updated_at = NOW()
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param("isii", $rating, $comment, $review_id, $user_id);

        if (!$stmt->execute()) {
            throw new Exception("Failed to update review");
        }
        $stmt->close();
    } else {
        // INSERT new review
        $stmt = $conn->prepare("SELECT id FROM teacher_course_reviews WHERE course_id = ? AND user_id = ? LIMIT 1");
        $stmt->bind_param("ii", $course_id, $user_id);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "You have already reviewed this course"]);
            $conn->rollback();
            exit;
        }
        $stmt->close();

        $stmt = $conn->prepare("
            INSERT INTO teacher_course_reviews (course_id, user_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("iiis", $course_id, $user_id, $rating, $comment);

        if (!$stmt->execute()) {
            throw new Exception("Failed to submit review");
        }
        $review_id = $conn->insert_id;
        $stmt->close();
    }

    // Update course average rating and total reviews
    $stmt = $conn->prepare("
        UPDATE teacher_courses 
        SET 
            average_rating = (SELECT AVG(rating) FROM teacher_course_reviews WHERE course_id = ?),
            total_reviews = (SELECT COUNT(*) FROM teacher_course_reviews WHERE course_id = ?)
        WHERE id = ?
    ");
    $stmt->bind_param("iii", $course_id, $course_id, $course_id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update course statistics");
    }
    $stmt->close();

    $conn->commit();

    // Get the review details for response
    $stmt = $conn->prepare("
        SELECT 
            tcr.id, tcr.rating, tcr.comment, tcr.created_at, 
            u.username, u.profile_pic
        FROM teacher_course_reviews tcr
        JOIN users u ON tcr.user_id = u.id
        WHERE tcr.id = ?
    ");
    $stmt->bind_param("i", $review_id);
    $stmt->execute();
    $review = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    echo json_encode([
        "status" => "success",
        "message" => "Review submitted successfully",
        "review" => [
            'id' => (int)$review['id'],
            'userId' => $user_id,
            'rating' => (int)$review['rating'],
            'comment' => $review['comment'],
            'author' => $review['username'],
            'userImage' => $review['profile_pic'],
            'date' => date('j F Y', strtotime($review['created_at']))
        ]
    ]);

} catch (Exception $e) {
    if (isset($conn)) $conn->rollback();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();
