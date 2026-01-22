<?php
require_once __DIR__ . '/../../config/session_config.php';
include("../../config/header.php");

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

    // Get limit from request (default: 5)
    $limit = isset($_GET['limit']) ? min(intval($_GET['limit']), 20) : 5;

    // Get top performing courses by total enrollments and revenue
    $stmt = $conn->prepare("
        SELECT 
            tc.id,
            tc.course_title as title,
            tc.thumbnail as image,
            tc.total_enrollments as students,
            tc.average_rating as rating,
            tc.price,
            COALESCE(SUM(tcp.amount), 0) as revenue
        FROM teacher_courses tc
        LEFT JOIN teacher_course_enroll tce ON tc.id = tce.course_id AND (tce.payment_status = 'paid' OR tce.payment_status = 'free')
        LEFT JOIN teacher_course_payment tcp ON tce.id = tcp.enrollment_id AND tcp.payment_status = 'success'
        WHERE tc.teacher_id = ? AND tc.status = 'published'
        GROUP BY tc.id
        ORDER BY revenue DESC, students DESC
        LIMIT ?
    ");

    $stmt->bind_param("ii", $teacher_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    $top_courses = [];
    while ($course = $result->fetch_assoc()) {
        $top_courses[] = [
            'id' => (int)$course['id'],
            'title' => $course['title'],
            'image' => $course['image'],
            'students' => (int)$course['students'],
            'rating' => round((float)$course['rating'], 1),
            'revenue' => (float)$course['revenue'],
            'price' => (float)$course['price']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'top_courses' => $top_courses
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
