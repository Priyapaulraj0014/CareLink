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

    $query = "SELECT i.*, 
              CONCAT(p.first_name, ' ', p.last_name) as patient_name
              FROM invoices i
              JOIN patients p ON i.patient_id = p.id
              ORDER BY i.invoice_date DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($invoices);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>