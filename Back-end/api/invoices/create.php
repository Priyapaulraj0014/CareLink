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
    $data = json_decode(file_get_contents("php://input"));

    if(empty($data->patient_id) || empty($data->total_amount)){
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $query = "INSERT INTO invoices 
              (patient_id, invoice_date, total_amount, status) 
              VALUES (:patient_id, :invoice_date, :total_amount, :status)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":patient_id", $data->patient_id);
    $stmt->bindParam(":invoice_date", $data->invoice_date);
    $stmt->bindParam(":total_amount", $data->total_amount);
    $stmt->bindParam(":status", $data->status);

    if($stmt->execute()) {
        echo json_encode([
            "message" => "Invoice created successfully",
            "id" => $db->lastInsertId()
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>