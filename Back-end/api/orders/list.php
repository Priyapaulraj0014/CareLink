<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'C:/xampp/htdocs/carelink-pro/Back-end/vendor/autoload.php';
include_once '../../config/database.php';

try {
    $db = (new Database())->getConnection();

    $query = "SELECT p.*, u.username as created_by_name 
              FROM purchase_orders p
              JOIN users u ON p.created_by = u.id
              ORDER BY p.order_date DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>