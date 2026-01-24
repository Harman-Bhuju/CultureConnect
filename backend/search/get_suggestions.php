<?php

/**
 * Get Search Suggestions API
 * Fetches unique suggestions from product names, course titles, and tags
 * Includes metadata (category, type) for smart redirection.
 */

require_once __DIR__ . '/../config/session_config.php';
include(__DIR__ . "/../config/header.php");

try {
    $query = isset($_GET['query']) ? trim($_GET['query']) : '';
    $type = isset($_GET['type']) ? trim($_GET['type']) : 'all';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

    $results = [];

    // CASE 1: Empty query - provide top recommendations
    if (empty($query)) {
        // Recommendations for Products
        if ($type === 'product' || $type === 'all') {
            $sql = "SELECT p.product_name as text, p.category, 'product' as type 
                    FROM products p 
                    WHERE p.status = 'published'";
            if (!empty($category)) $sql .= " AND p.category = ?";
            $sql .= " ORDER BY p.total_sales DESC LIMIT 5";

            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("s", $category);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();
        }

        // Recommendations for Courses
        if ($type === 'course' || $type === 'all') {
            $sql = "SELECT tc.course_title as text, tc.category, 'course' as type 
                    FROM teacher_courses tc 
                    WHERE tc.status = 'published'";
            if (!empty($category)) $sql .= " AND tc.category = ?";
            $sql .= " ORDER BY average_rating DESC LIMIT 5";

            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("s", $category);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();
        }
    }
    // CASE 2: Actual search query
    else {
        $searchTerm = "%$query%";

        // Products
        if ($type === 'product' || $type === 'all') {
            // Names
            $sql = "SELECT DISTINCT p.product_name as text, p.category, 'product' as type 
                    FROM products p 
                    WHERE p.status = 'published' AND p.product_name LIKE ?";
            if (!empty($category)) $sql .= " AND p.category = ?";
            $sql .= " LIMIT 5";
            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("ss", $searchTerm, $category);
            else $stmt->bind_param("s", $searchTerm);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();

            // Tags (returning tag text but linking to the category of the first matching product)
            $sql = "SELECT DISTINCT pt.tag as text, p.category, 'product' as type 
                    FROM product_tags pt 
                    INNER JOIN products p ON pt.product_id = p.id 
                    WHERE p.status = 'published' AND pt.tag LIKE ?";
            if (!empty($category)) $sql .= " AND p.category = ?";
            $sql .= " LIMIT 5";
            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("ss", $searchTerm, $category);
            else $stmt->bind_param("s", $searchTerm);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();
        }

        // Courses
        if ($type === 'course' || $type === 'all') {
            // Titles
            $sql = "SELECT DISTINCT tc.course_title as text, tc.category, 'course' as type 
                    FROM teacher_courses tc 
                    WHERE tc.status = 'published' AND tc.course_title LIKE ?";
            if (!empty($category)) $sql .= " AND tc.category = ?";
            $sql .= " LIMIT 5";
            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("ss", $searchTerm, $category);
            else $stmt->bind_param("s", $searchTerm);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();

            // Tags
            $sql = "SELECT DISTINCT tct.tag as text, tc.category, 'course' as type 
                    FROM teacher_course_tags tct 
                    INNER JOIN teacher_courses tc ON tct.course_id = tc.id 
                    WHERE tc.status = 'published' AND tct.tag LIKE ?";
            if (!empty($category)) $sql .= " AND tc.category = ?";
            $sql .= " LIMIT 5";
            $stmt = $conn->prepare($sql);
            if (!empty($category)) $stmt->bind_param("ss", $searchTerm, $category);
            else $stmt->bind_param("s", $searchTerm);
            $stmt->execute();
            $res = $stmt->get_result();
            while ($r = $res->fetch_assoc()) $results[] = $r;
            $stmt->close();
        }
    }

    // Deduplicate suggestions based on text
    $uniqueResults = [];
    $seen = [];
    foreach ($results as $item) {
        $key = strtolower($item['text']);
        if (!isset($seen[$key])) {
            $seen[$key] = true;
            $uniqueResults[] = $item;
        }
    }

    echo json_encode([
        'success' => true,
        'suggestions' => array_slice($uniqueResults, 0, $limit),
        'is_recommendation' => empty($query)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
