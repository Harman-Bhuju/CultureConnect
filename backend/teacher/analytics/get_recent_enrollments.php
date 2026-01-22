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

    // Get limit from request (default: 10)
    $limit = isset($_GET['limit']) ? min(intval($_GET['limit']), 50) : 10;

    // Get recent enrollments for teacher's courses
    $stmt = $conn->prepare("
        SELECT
            ts.id,
            u.username as student_name,
            u.profile_pic as student_avatar,
            tc.course_title,
            tc.id as course_id,
            COALESCE(tcp.amount, 0) as amount,
            tcp.transaction_uuid,
            tcp.payment_method,
            ts.enrollment_date as date,
            ts.payment_status
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        JOIN users u ON ts.student_id = u.id
        LEFT JOIN teacher_course_payment tcp ON ts.id = tcp.enrollment_id AND tcp.payment_status = 'success'
        WHERE tc.teacher_id = ?
        ORDER BY ts.enrollment_date DESC
        LIMIT ?
    ");

    $stmt->bind_param("ii", $teacher_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    $enrollments = [];
    while ($enrollment = $result->fetch_assoc()) {
        // Format date
        $date = date("Y-m-d", strtotime($enrollment['date']));


        $enrollments[] = [
            'id' => (string)$enrollment['id'],
            'student_name' => $enrollment['student_name'],
            'student_avatar' => $enrollment['student_avatar'],
            'course_title' => $enrollment['course_title'],
            'course_id' => (int)$enrollment['course_id'],
            'amount' => (float)$enrollment['amount'],
            'transaction_uuid' => $enrollment['transaction_uuid'],
            'payment_method' => $enrollment['payment_method'],
            'date' => $date,
            'status' => $enrollment['payment_status'],
            'payment_status' => $enrollment['payment_status']
        ];
    }
    $stmt->close();

    echo json_encode([
        'success' => true,
        'enrollments' => $enrollments
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
