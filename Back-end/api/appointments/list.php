<?php
header("Access-Control-Allow-Origin: *");
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

    $query = "SELECT a.*, 
              CONCAT(p.first_name, ' ', p.last_name) as patient_name,
              u.username as doctor_name
              FROM appointments a
              JOIN patients p ON a.patient_id = p.id
              JOIN users u ON a.doctor_id = u.id
              ORDER BY a.appointment_date DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($appointments);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>