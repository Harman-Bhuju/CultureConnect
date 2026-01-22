<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/dbconnect.php");

$frontend_base = $_SESSION['frontend_url'] ?? "http://localhost:5173";

try {
    $transaction_uuid = $_GET['transaction_uuid'] ?? null;
    $teacher_id = $_GET['teacher_id'] ?? null;
    $course_id = $_GET['course_id'] ?? null;
    $enrollment_id = $_GET['enrollment_id'] ?? null;

    if ($transaction_uuid) {
        $stmt = $conn->prepare("
            SELECT pt.*, ts.course_id
            FROM teacher_course_payment pt
            JOIN teacher_course_enroll ts ON pt.enrollment_id = ts.id
            WHERE pt.transaction_uuid = ?
            LIMIT 1
        ");
        $stmt->bind_param("s", $transaction_uuid);
        $stmt->execute();
        $result = $stmt->get_result();
        $transaction = $result->fetch_assoc();
        $stmt->close();

        if ($transaction) {
            $stmt = $conn->prepare("
                UPDATE teacher_course_payment 
                SET payment_status = 'failed',
                    updated_at = NOW()
                WHERE transaction_uuid = ?
            ");
            $stmt->bind_param("s", $transaction_uuid);
            $stmt->execute();
            $stmt->close();

            // We need teacher_id for redirection. Fetch it from teacher_courses
            $stmt = $conn->prepare("SELECT teacher_id FROM teacher_courses WHERE id = ? LIMIT 1");
            $stmt->bind_param("i", $transaction['course_id']);
            $stmt->execute();
            $course_info = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            $redirect_teacher_id = $teacher_id ?? ($course_info ? $course_info['teacher_id'] : null);
            $redirect_course_id = $course_id ?? $transaction['course_id'];

            if ($redirect_teacher_id && $redirect_course_id) {
                header("Location: {$frontend_base}/courses/{$redirect_teacher_id}/{$redirect_course_id}?error=" . urlencode("Payment failed or cancelled. Please try again.") . "&payment=failed");
                exit;
            }
        }
    }

    if ($teacher_id && $course_id) {
        header("Location: {$frontend_base}/courses/{$teacher_id}/{$course_id}?error=" . urlencode("Payment was cancelled. Please try again.") . "&payment=failed");
        exit;
    }

    header("Location: {$frontend_base}/?error=" . urlencode("Payment failed. Please try again.") . "&payment=failed");
    exit;
} catch (Exception $e) {
    if (isset($_GET['teacher_id']) && isset($_GET['course_id'])) {
        header("Location: {$frontend_base}/courses/{$_GET['teacher_id']}/{$_GET['course_id']}?error=" . urlencode("Payment error occurred") . "&payment=failed");
    } else {
        header("Location: {$frontend_base}/?error=" . urlencode("Payment error") . "&payment=failed");
    }
    exit;
}

$conn->close();
