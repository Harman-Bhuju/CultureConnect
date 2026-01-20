<?php
require_once __DIR__ . '/../config/session_config.php';
include("../config/header.php");

// Debug: Log all headers (optional)
// error_log(print_r(getallheaders(), true));

// 1. Get seller_id from GET request
$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : 0;

if ($seller_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid seller ID"]);
    exit;
}

// 2. Query to fetch followers
// We join seller_followers with users table to get follower details
$query = "
    SELECT 
        u.id AS user_id,
        u.username,
        u.profile_pic,
        sf.created_at AS followed_at
    FROM seller_followers sf
    INNER JOIN users u ON sf.user_id = u.id
    WHERE sf.seller_id = ?
    ORDER BY sf.created_at DESC
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $seller_id);
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

// 3. Fetch Seller's User Info (Profile Pic & Username)
// Get the user_id associated with this seller
$seller_user_stmt = $conn->prepare("
    SELECT u.username, u.profile_pic 
    FROM sellers s
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ?
");
$seller_user_stmt->bind_param("i", $seller_id);
$seller_user_stmt->execute();
$seller_user_result = $seller_user_stmt->get_result();
$seller_info = $seller_user_result->fetch_assoc();
$seller_user_stmt->close();
$conn->close(); // Close connection here after all queries are done

echo json_encode([
    "status" => "success",
    "followers" => $followers,
    "count" => count($followers),
    "name" => $seller_info['username'] ?? "Seller",
    "profile_pic" => $seller_info['profile_pic'] ?? null
]);
exit;
