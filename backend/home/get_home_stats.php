<?php
include("../config/header.php");

try {
    // 1. Total Sellers
    $seller_query = "SELECT COUNT(*) as total_sellers FROM sellers";
    $seller_result = $conn->query($seller_query);
    $total_sellers = $seller_result->fetch_assoc()['total_sellers'] ?? 0;

    // 2. Total Products
    $product_query = "SELECT COUNT(*) as total_products FROM products";
    $product_result = $conn->query($product_query);
    $total_products = $product_result->fetch_assoc()['total_products'] ?? 0;

    // 3. Total Teachers (Experts)
    $teacher_query = "SELECT COUNT(*) as total_teachers FROM teachers WHERE status = 'approved'";
    $teacher_result = $conn->query($teacher_query);
    $total_teachers = $teacher_result->fetch_assoc()['total_teachers'] ?? 0;

    // 4. Total Courses
    $course_query = "SELECT COUNT(*) as total_courses FROM teacher_courses";
    $course_result = $conn->query($course_query);
    $total_courses = $course_result->fetch_assoc()['total_courses'] ?? 0;

    // 5. Total Art Forms = Total Courses (cultural learning opportunities)
    // This represents the variety of cultural art forms being taught
    $art_forms_count = $total_courses;

    // 6. Community Reach = Total Users (excluding admin)
    $users_query = "SELECT COUNT(*) as total_users FROM users WHERE role != 'admin'";
    $users_result = $conn->query($users_query);
    $total_users = $users_result->fetch_assoc()['total_users'] ?? 0;

    // 7. Category Counts
    $cat_counts_query = "SELECT category, COUNT(*) as count FROM products GROUP BY category";
    $cat_counts_result = $conn->query($cat_counts_query);
    $category_counts = [];
    while ($row = $cat_counts_result->fetch_assoc()) {
        $category_counts[$row['category']] = (int)$row['count'];
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_sellers" => (int)$total_sellers,
            "total_products" => (int)$total_products,
            "total_teachers" => (int)$total_teachers,
            "total_courses" => (int)$total_courses,
            "total_art_forms" => (int)$art_forms_count,
            "total_users" => (int)$total_users,
            "category_counts" => $category_counts
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch stats: " . $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
