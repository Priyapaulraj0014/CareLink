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

    // Total patients
    $stmt = $db->query("SELECT COUNT(*) as count FROM patients");
    $totalPatients = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Today's appointments
    $stmt = $db->query("SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURDATE()");
    $todayAppointments = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Pending orders
    $stmt = $db->query("SELECT COUNT(*) as count FROM purchase_orders WHERE status = 'pending'");
    $pendingOrders = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Unpaid invoices
    $stmt = $db->query("SELECT COUNT(*) as count FROM invoices WHERE status = 'pending'");
    $unpaidInvoices = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    echo json_encode([
        "total_patients" => $totalPatients,
        "today_appointments" => $todayAppointments,
        "pending_orders" => $pendingOrders,
        "unpaid_invoices" => $unpaidInvoices,
    ]);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>