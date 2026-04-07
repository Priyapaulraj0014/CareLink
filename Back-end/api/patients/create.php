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
include_once '../../middleware/auth.php';

// Only admin, doctor, receptionist can create patients
$auth = new Auth();
$auth->requireRole(['admin', 'doctor', 'receptionist']);

try {
    $db = (new Database())->getConnection();
    $data = json_decode(file_get_contents("php://input"));

    if(empty($data->first_name) || empty($data->last_name) || empty($data->phone)){
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $query = "INSERT INTO patients 
              (first_name, last_name, dob, phone, email, address, emergency_contact, medical_history) 
              VALUES (:first_name, :last_name, :dob, :phone, :email, :address, :emergency_contact, :medical_history)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":first_name", $data->first_name);
    $stmt->bindParam(":last_name", $data->last_name);
    $stmt->bindParam(":dob", $data->dob);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":address", $data->address);
    $stmt->bindParam(":emergency_contact", $data->emergency_contact);
    $stmt->bindParam(":medical_history", $data->medical_history);

    if($stmt->execute()) {
        echo json_encode([
            "message" => "Patient created successfully",
            "id" => $db->lastInsertId()
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>