<?php
session_start();
require_once(__DIR__ . '/../config.php');
header('Content-Type: application/json');

// Prüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Nicht eingeloggt']);
    exit;
}

$benutzerId = $_SESSION['user_id'];

// JSON-Daten einlesen
$input = json_decode(file_get_contents("php://input"), true);
$eventId = $input['event_id'] ?? null;
$status = $input['status'] ?? null;

$gueltigeStatus = ['angenommen', 'abgelehnt', 'vielleicht'];

// Prüfung
if (!$eventId || !in_array($status, $gueltigeStatus)) {
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Daten']);
    exit;
}

// Prüfen, ob der Benutzer überhaupt zu diesem Event eingeladen ist
$stmt = $pdo->prepare("SELECT * FROM event_has_benutzer WHERE event_id = ? AND benutzer_id = ?");
$stmt->execute([$eventId, $benutzerId]);
$eintrag = $stmt->fetch();

if (!$eintrag) {
    echo json_encode(['status' => 'error', 'message' => 'Keine Einladung zu diesem Event']);
    exit;
}

// Status aktualisieren
$stmt = $pdo->prepare("UPDATE event_has_benutzer SET status = ? WHERE event_id = ? AND benutzer_id = ?");
$stmt->execute([$status, $eventId, $benutzerId]);

echo json_encode(['status' => 'success']);
