<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cultureconnect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "--- Teachers Table ---\n";
$result = $conn->query("DESCRIBE teachers");
while ($row = $result->fetch_assoc()) echo $row['Field'] . " ";
echo "\n";

echo "--- Teacher Followers Table ---\n";
$result = $conn->query("DESCRIBE teacher_followers");
if ($result) {
    while ($row = $result->fetch_assoc()) echo $row['Field'] . " ";
} else {
    echo "Error: " . $conn->error;
}
echo "\n";
