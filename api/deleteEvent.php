<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$eventId = $_POST['event_id'] ?? null;

if (!$eventId) {
    echo json_encode(['status' => "error", "message" => "Keine Event-ID übergeben"]);
    exit;
}

// Gehört das Event dem aktuellen Benutzer?
$stmt = $pdo->prepare("SELECT id FROM events WHERE id = ? AND benutzer_id = ?");
$stmt->execute([$eventId, $_SESSION['user_id']]);
$event = $stmt->fetch();

if (!$event) {
    echo json_encode(['status' => "error", "message" => "Kein Zugriff auf dieses Event"]);
    exit;
}

// 1. Zuordnungen löschen
$pdo->prepare("DELETE FROM event_has_benutzer WHERE event_id = ?")->execute([$eventId]);

// 2. Event löschen
$pdo->prepare("DELETE FROM events WHERE id = ?")->execute([$eventId]);

echo json_encode(['status' => "success"]);
