<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

// Events, die vom User erstellt wurden oder wo der Status "accepted" ist
$stmt = $pdo->prepare("SELECT e.*, b.firstName AS creator_name, b.profilbild AS creator_pic
    FROM events e
    LEFT JOIN event_has_benutzer eb ON e.id = eb.event_id
    JOIN benutzer b ON e.benutzer_id = b.id
    WHERE e.benutzer_id = :uid OR (eb.benutzer_id = :uid AND eb.status = 'accepted')");
$stmt->execute([':uid' => $userId]);

$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["status" => "success", "events" => $events]);