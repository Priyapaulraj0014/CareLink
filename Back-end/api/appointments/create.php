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

    if(empty($data->patient_id) || empty($data->doctor_id) || empty($data->appointment_date)){
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $query = "INSERT INTO appointments 
              (patient_id, doctor_id, appointment_date, status, notes) 
              VALUES (:patient_id, :doctor_id, :appointment_date, :status, :notes)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":patient_id", $data->patient_id);
    $stmt->bindParam(":doctor_id", $data->doctor_id);
    $stmt->bindParam(":appointment_date", $data->appointment_date);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":notes", $data->notes);

    if($stmt->execute()) {
        echo json_encode([
            "message" => "Appointment created successfully",
            "id" => $db->lastInsertId()
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>