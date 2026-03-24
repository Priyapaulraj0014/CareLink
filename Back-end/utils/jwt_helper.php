<?php
require_once 'C:/xampp/htdocs/carelink-pro/Back-end/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function generateJWT($userId, $role) {
    $secret_key = "CARELINK_SECRET_KEY_2025_HEALTHCARE_PLATFORM_SECURE";
    $payload = [
        "iss" => "carelinkpro",
        "aud" => "carelinkpro",
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24),
        "data" => [
            "user_id" => $userId,
            "role" => $role
        ]
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
}

function verifyJWT($token) {
   $secret_key = "CARELINK_SECRET_KEY_2025_HEALTHCARE_PLATFORM_SECURE";
    return JWT::decode($token, new Key($secret_key, 'HS256'));
}
?>