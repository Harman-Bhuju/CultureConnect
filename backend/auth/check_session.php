<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

function isAuthenticated()
{
    return isset($_SESSION['user_email']);
}

$current_user_email = $_SESSION['user_email'] ?? null;
// Device ID logic removed



$savedAccounts = [];
// Saved accounts logic removed


$current_user_data = null;
if ($current_user_email) {

    // Fetch full user info + seller_id in a single query
    $stmt = $conn->prepare("
SELECT
u.id,
u.email,
u.username,
u.profile_pic,
u.gender,
u.province,
u.district,
u.municipality,
u.ward,
u.role,
s.id AS seller_id,
t.id AS teacher_id,
t.status AS teacher_status
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
LEFT JOIN teachers t ON u.id = t.user_id
WHERE u.email = ?
LIMIT 1
");

    $stmt->bind_param("s", $current_user_email);
    $stmt->execute();

    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($row) {
        $current_user_data = [
            "id" => (int)$row['id'],
            "email" => $row['email'],
            "name" => $row['username'],
            "avatar" => $row['profile_pic'],
            "gender" => $row['gender'],
            "location" => [
                "province" => $row['province'],
                "district" => $row['district'],
                "municipality" => $row['municipality'],
                "ward" => $row['ward']
            ],
            "role" => $row['role'],
            "seller_id" => $row['seller_id'] ?? null,
            "teacher_id" => $row['teacher_id'] ?? null,
            "teacher_status" => $row['teacher_status'] ?? null

        ];
    }
}


echo json_encode([
    "status" => "success",
    "logged_in" => !!$current_user_data,
    "user" => $current_user_data
]);

$conn->close();
exit;
