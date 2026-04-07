<?php
require_once 'C:/xampp/htdocs/carelink-pro/Back-end/vendor/autoload.php';
include_once __DIR__ . '/../utils/jwt_helper.php';

class Auth {
    public $user_id;
    public $role;

    public function verifyToken() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(["message" => "No token provided"]);
            exit();
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);

        try {
            $decoded = verifyJWT($token);
            $this->user_id = $decoded->data->user_id;
            $this->role = $decoded->data->role;
            return true;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid or expired token"]);
            exit();
        }
    }

    public function requireRole($allowedRoles) {
        $this->verifyToken();
        
        if (!in_array($this->role, $allowedRoles)) {
            http_response_code(403);
            echo json_encode(["message" => "Access denied. Insufficient permissions."]);
            exit();
        }
    }
}
?>