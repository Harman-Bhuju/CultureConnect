<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

try {
    $user_email = $_SESSION['user_email'];

    if (!$user_email) {
        echo json_encode(["success" => false, "error" => "User not authenticated"]);
        exit;
    }

    // Get POST data
    $teacher_id = $_POST['teacher_id'] ?? null;
    $course_id = $_POST['course_id'] ?? null;

    // Validate required fields
    if (!$teacher_id || !$course_id) {
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // Get user_id
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        echo json_encode(["success" => false, "error" => "User not found"]);
        exit;
    }

    $user_id = $user['id'];

    // Get course details
    $stmt = $conn->prepare("
        SELECT 
            id,
            teacher_id,
            course_title,
            price,
            status,
            thumbnail
        FROM teacher_courses 
        WHERE id = ? AND teacher_id = ? AND status = 'published'
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $teacher_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $course = $result->fetch_assoc();
    $stmt->close();

    if (!$course) {
        echo json_encode(["success" => false, "error" => "Course not found or not available"]);
        exit;
    }

    // Check if course is free
    if ($course['price'] == 0) {
        echo json_encode(["success" => false, "error" => "This course is free. Please use direct enrollment."]);
        exit;
    }

    // Check if already enrolled (only block if paid or free)
    $stmt = $conn->prepare("
        SELECT id FROM teacher_course_enroll 
        WHERE course_id = ? AND student_id = ? 
        AND (payment_status = 'paid' OR payment_status = 'free')
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing_enrollment = $result->fetch_assoc();
    $stmt->close();

    if ($existing_enrollment) {
        echo json_encode(["success" => false, "error" => "You are already enrolled in this course"]);
        exit;
    }

    // Check if there's an existing pending enrollment for this course
    $stmt = $conn->prepare("
        SELECT id 
        FROM teacher_course_enroll 
        WHERE course_id = ? 
        AND student_id = ? 
        AND payment_status = 'pending'
        AND enrollment_date > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        LIMIT 1
    ");
    $stmt->bind_param("ii", $course_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing_pending = $result->fetch_assoc();
    $stmt->close();

    // Start transaction
    $conn->begin_transaction();

    try {
        if ($existing_pending) {
            // Use existing pending enrollment
            $enrollment_id = $existing_pending['id'];
        } else {
            $stmt = $conn->prepare("
                INSERT INTO teacher_course_enroll (
                    course_id,
                    student_id,
                    enrollment_date,
                    payment_status
                ) VALUES (?, ?, NOW(), 'pending')
            ");
            $stmt->bind_param("ii", $course_id, $user_id);
            $stmt->execute();
            $enrollment_id = $conn->insert_id;
            $stmt->close();
        }

        // Prepare response
        $response = [
            "success" => true,
            "enrollment_id" => (int)$enrollment_id,
            "course" => [
                "id" => (int)$course['id'],
                "course_title" => $course['course_title'],
                "price" => (float)$course['price'],
                "thumbnail" => $course['thumbnail']
            ]
        ];

        $conn->commit();
        echo json_encode($response);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
