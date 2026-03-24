<?php
class Database {
    private $host = "localhost";
    private $db_name = "carelink_pro";
    private $username = "root";   // change if needed
    private $password = "";       // change if needed
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo json_encode(["error" => $exception->getMessage()]);
        }
        return $this->conn;
    }
}
