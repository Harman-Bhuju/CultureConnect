<?php
// Bypass dbconnect.php since CLI doesn't have env vars
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cultureconnect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "--- SELLERS ---\n";
$result = $conn->query("SELECT id, user_id, store_name, followers FROM sellers");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | UserID: " . $row['user_id'] . " | Store: " . $row['store_name'] . " | Followers: " . $row['followers'] . "\n";
    }
} else {
    echo "Error fetching sellers: " . $conn->error . "\n";
}

echo "\n--- SELLER FOLLOWERS ---\n";
$result = $conn->query("SELECT id, user_id, seller_id, created_at FROM seller_followers");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | UserID (Follower): " . $row['user_id'] . " | SellerID: " . $row['seller_id'] . " | Date: " . $row['created_at'] . "\n";
    }
} else {
    echo "Error fetching seller_followers: " . $conn->error . "\n";
}

echo "\n--- TEACHERS ---\n";
$result = $conn->query("SELECT id, user_id, teacher_name, followers FROM teachers");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | UserID: " . $row['user_id'] . " | Name: " . $row['teacher_name'] . " | Followers: " . $row['followers'] . "\n";
    }
} else {
    echo "Error fetching teachers: " . $conn->error . "\n";
}

echo "\n--- TEACHER FOLLOWERS ---\n";
$result = $conn->query("SELECT id, follower_user_id, teacher_id, created_at FROM teacher_followers");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | FollowerID: " . $row['follower_user_id'] . " | TeacherID: " . $row['teacher_id'] . " | Date: " . $row['created_at'] . "\n";
    }
} else {
    echo "Error fetching teacher_followers: " . $conn->error . "\n";
}

$conn->close();
