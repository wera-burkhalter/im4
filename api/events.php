<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

// Wenn nicht eingeloggt
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Profilbild des eingeloggten Benutzers laden
$stmt = $pdo->prepare("SELECT profilbild FROM benutzer WHERE id = ?");
$stmt->execute([$user_id]);
$profilbild = $stmt->fetchColumn();

// Events vom Benutzer laden
$stmt = $pdo->prepare("SELECT id, title, date, place FROM events WHERE benutzer_id = ?");
$stmt->execute([$user_id]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Teilnehmer zu jedem Event holen
foreach ($events as &$event) {
    $stmt = $pdo->prepare("
        SELECT b.firstName, b.profilbild
        FROM event_has_benutzer ehb
        JOIN benutzer b ON ehb.benutzer_id = b.id
        WHERE ehb.event_id = ? AND ehb.status = 'angefragt'
        LIMIT 3
    ");
    $stmt->execute([$event['id']]);
    $event['anfragen'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gesamtzahl (inkl. +x)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM event_has_benutzer WHERE event_id = ? AND status = 'angefragt'");
    $stmt->execute([$event['id']]);
    $event['anfrage_anzahl'] = $stmt->fetchColumn();
}

echo json_encode([
    "status" => "success",
    "profilbild" => $profilbild,
    "events" => $events
]);
