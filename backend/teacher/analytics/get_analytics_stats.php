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

    // Get period from request (default: "This month")
    $period = isset($_GET['period']) ? $_GET['period'] : 'This month';

    // Fetch dynamic stats for the selected period
    $date_filter = "";
    if ($period === 'This month') {
        $date_filter = "AND ts.enrollment_date >= DATE_FORMAT(NOW() ,'%Y-%m-01')";
    } elseif ($period === 'This year') {
        $date_filter = "AND ts.enrollment_date >= DATE_FORMAT(NOW() ,'%Y-01-01')";
    }

    // Get dynamic counts
    $stmt = $conn->prepare("
        SELECT 
            COUNT(DISTINCT ts.student_id) as total_students,
            COALESCE(SUM(tcp.amount), 0) as total_revenue
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        LEFT JOIN teacher_course_payment tcp ON ts.id = tcp.enrollment_id AND tcp.payment_status = 'success'
        WHERE tc.teacher_id = ? 
        AND (ts.payment_status = 'paid' OR ts.payment_status = 'free')
        $date_filter
    ");

    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $teacher_stats = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // Get other teacher info
    $stmt = $conn->prepare("SELECT total_courses, followers FROM teachers WHERE id = ?");
    $stmt->bind_param("i", $teacher_id);
    $stmt->execute();
    $teacher_info = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // Get course statistics
    $course_stmt = $conn->prepare("
        SELECT 
            COUNT(CASE WHEN status = 'published' THEN 1 END) as active_courses,
            COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_courses,
            COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_courses,
            COUNT(*) as total_courses,
            COALESCE(AVG(average_rating), 0) as average_rating
        FROM teacher_courses
        WHERE teacher_id = ?
    ");

    $course_stmt->bind_param("i", $teacher_id);
    $course_stmt->execute();
    $course_result = $course_stmt->get_result();
    $course_data = $course_result->fetch_assoc();
    $course_stmt->close();

    // Get total enrolled students across all courses
    $student_stmt = $conn->prepare("
        SELECT COUNT(DISTINCT ts.student_id) as unique_students
        FROM teacher_course_enroll ts
        JOIN teacher_courses tc ON ts.course_id = tc.id
        WHERE tc.teacher_id = ?
    ");
    $student_stmt->bind_param("i", $teacher_id);
    $student_stmt->execute();
    $student_result = $student_stmt->get_result();
    $student_data = $student_result->fetch_assoc();
    $student_stmt->close();

    echo json_encode([
        'success' => true,
        'period' => $period,
        'stats' => [
            'total_revenue' => (float)$teacher_stats['total_revenue'],
            'total_students' => (int)$teacher_stats['total_students'],
            'total_courses' => (int)$teacher_info['total_courses'],
            'average_rating' => round((float)$course_data['average_rating'], 1),
            'followers' => (int)$teacher_info['followers']
        ],
        'course_stats' => [
            'active_courses' => (int)$course_data['active_courses'],
            'draft_courses' => (int)$course_data['draft_courses'],
            'archived_courses' => (int)$course_data['archived_courses'],
            'total_courses' => (int)$course_data['total_courses']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
