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
include_once '../../utils/jwt_helper.php';

try {
    $db = (new Database())->getConnection();
    $data = json_decode(file_get_contents("php://input"));

    // Get user from token
    $headers = getallheaders();
    $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
    $decoded = verifyJWT($token);
    $user_id = $decoded->data->user_id;

    if(empty($data->supplier_name) || empty($data->order_date) || empty($data->total_amount)){
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $query = "INSERT INTO purchase_orders 
              (supplier_name, order_date, status, total_amount, created_by) 
              VALUES (:supplier_name, :order_date, :status, :total_amount, :created_by)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":supplier_name", $data->supplier_name);
    $stmt->bindParam(":order_date", $data->order_date);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":total_amount", $data->total_amount);
    $stmt->bindParam(":created_by", $user_id);

    if($stmt->execute()) {
        echo json_encode([
            "message" => "Order created successfully",
            "id" => $db->lastInsertId()
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>