<?php
include_once __DIR__ . '/../utils/jwt_helper.php';

class Auth {
    public $user_id;
    public $role;

    public function verifyToken() {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            return false;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);

        try {
            $decoded = verifyJWT($token);
            $this->user_id = $decoded->data->user_id;
            $this->role = $decoded->data->role;
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
