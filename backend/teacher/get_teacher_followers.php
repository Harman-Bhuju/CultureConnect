<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// 1. Get teacher_id from GET request
$teacher_id = isset($_GET['teacher_id']) ? intval($_GET['teacher_id']) : 0;

if ($teacher_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid teacher ID"]);
    exit;
}

// 2. Query to fetch teacher followers
// Joining teacher_followers with users table to get follower details
// Note: Based on provided SQL structure, table is teacher_followers, columns: teacher_id, follower_user_id
$query = "
    SELECT 
        u.id AS user_id,
        u.username,
        u.profile_pic,
        tf.followed_at
    FROM teacher_followers tf
    INNER JOIN users u ON tf.follower_user_id = u.id
    WHERE tf.teacher_id = ?
    ORDER BY tf.followed_at DESC
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

$followers = [];
while ($row = $result->fetch_assoc()) {
    $followers[] = [
        "user_id" => $row['user_id'],
        "username" => $row['username'],
        "profile_pic" => $row['profile_pic'],
        "followed_at" => $row['followed_at']
    ];
}

$stmt->close();
// Note: Do NOT close connection here, we need it for the next query

// 3. Fetch Teacher's User Info (Profile Pic & Username)
// Get the user_id associated with this teacher
$teacher_user_stmt = $conn->prepare("
    SELECT u.username, u.profile_pic 
    FROM teachers t
    JOIN users u ON t.user_id = u.id 
    WHERE t.id = ?
");
$teacher_user_stmt->bind_param("i", $teacher_id);
$teacher_user_stmt->execute();
$teacher_user_result = $teacher_user_stmt->get_result();
$teacher_info = $teacher_user_result->fetch_assoc();
$teacher_user_stmt->close();
$conn->close(); // Close connection here after all queries are done

echo json_encode([
    "status" => "success",
    "followers" => $followers,
    "count" => count($followers),
    "name" => $teacher_info['username'] ?? "Teacher",
    "profile_pic" => $teacher_info['profile_pic'] ?? null
]);
exit;
