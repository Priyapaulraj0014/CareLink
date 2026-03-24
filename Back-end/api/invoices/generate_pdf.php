<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'C:/xampp/htdocs/carelink-pro/Back-end/vendor/autoload.php';
include_once '../../config/database.php';

use Dompdf\Dompdf;
use Dompdf\Options;

try {
    $db = (new Database())->getConnection();
    $invoice_id = $_GET['id'] ?? null;

    if(!$invoice_id) {
        echo json_encode(["error" => "Invoice ID required"]);
        exit;
    }

    $query = "SELECT i.*, 
              CONCAT(p.first_name, ' ', p.last_name) as patient_name,
              p.phone, p.email, p.address
              FROM invoices i
              JOIN patients p ON i.patient_id = p.id
              WHERE i.id = :id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $invoice_id);
    $stmt->execute();
    $invoice = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$invoice) {
        echo json_encode(["error" => "Invoice not found"]);
        exit;
    }

    $options = new Options();
    $options->set('defaultFont', 'Arial');
    $dompdf = new Dompdf($options);

    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0 0 0; opacity: 0.8; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-block h3 { color: #667eea; margin: 0 0 10px 0; }
            .info-block p { margin: 4px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #667eea; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total-row { background: #f8f9fa; font-weight: bold; font-size: 16px; }
            .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏥 CareLink Pro</h1>
            <p>Healthcare Services Management Platform</p>
        </div>

        <div class="invoice-info">
            <div class="info-block">
                <h3>Invoice Details</h3>
                <p><strong>Invoice #:</strong> INV-' . str_pad($invoice['id'], 4, '0', STR_PAD_LEFT) . '</p>
                <p><strong>Date:</strong> ' . $invoice['invoice_date'] . '</p>
                <p><strong>Status:</strong> ' . strtoupper($invoice['status']) . '</p>
            </div>
            <div class="info-block">
                <h3>Patient Information</h3>
                <p><strong>Name:</strong> ' . $invoice['patient_name'] . '</p>
                <p><strong>Phone:</strong> ' . $invoice['phone'] . '</p>
                <p><strong>Email:</strong> ' . $invoice['email'] . '</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Medical Services</td>
                    <td>$' . number_format($invoice['total_amount'], 2) . '</td>
                </tr>
                <tr class="total-row">
                    <td>Total Amount</td>
                    <td>$' . number_format($invoice['total_amount'], 2) . '</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>Thank you for choosing CareLink Pro Healthcare Services</p>
            <p>Generated on ' . date('Y-m-d H:i:s') . '</p>
        </div>
    </body>
    </html>';

    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $dompdf->stream('invoice_' . $invoice_id . '.pdf', ['Attachment' => true]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>