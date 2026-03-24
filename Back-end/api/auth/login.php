<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../utils/jwt_helper.php';

$db = (new Database())->getConnection();
$data = json_decode(file_get_contents("php://input"));

if(empty($data->username) || empty($data->password)){
    echo json_encode(["message" => "Missing credentials"]);
    exit;
}

$query = "SELECT * FROM users WHERE username = :username";
$stmt = $db->prepare($query);
$stmt->bindParam(":username", $data->username);
$stmt->execute();

if($stmt->rowCount() === 0){
    echo json_encode(["message" => "User not found"]);
    exit;
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!password_verify($data->password, $user['password'])){
    echo json_encode(["message" => "Invalid password"]);
    exit;
}

$token = generateJWT($user['id'], $user['role']);

echo json_encode([
    "message" => "Login successful",
    "token" => $token,
    "role" => $user['role']
]);
?>