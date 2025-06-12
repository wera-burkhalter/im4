<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => "error", 'message' => "Nicht eingeloggt"]);
    exit;
}

$eventId = $_GET['id'] ?? null;

if (!$eventId) {
    echo json_encode(['status' => "error", 'message' => "Event-ID fehlt"]);
    exit;
}

// Event-Daten (optional, falls du auch Titel etc. brauchst)
$stmt = $pdo->prepare("SELECT id, title FROM events WHERE id = ? AND benutzer_id = ?");
$stmt->execute([$eventId, $_SESSION['user_id']]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$event) {
    echo json_encode(['status' => "error", 'message' => "Kein Zugriff auf dieses Event"]);
    exit;
}

// Eingeladene Freunde + Status
$stmt = $pdo->prepare("
    SELECT 
        b.firstName, b.surname, b.profilbild, ehb.status
    FROM event_has_benutzer ehb
    JOIN benutzer b ON b.id = ehb.benutzer_id
    WHERE ehb.event_id = ?
");
$stmt->execute([$eventId]);
$guests = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Gäste nach Status gruppieren
$eingeladeneGruppiert = [
    'angenommen' => [],
    'abgelehnt' => [],
    'vielleicht' => [],
    'offen' => []
];

foreach ($guests as $guest) {
    $status = strtolower($guest['status']);
    if (!isset($eingeladeneGruppiert[$status])) {
        $eingeladeneGruppiert[$status] = [];
    }

    $eingeladeneGruppiert[$status][] = [
        "name" => $guest['firstName'] . " " . $guest['surname'],
        "profilbild" => $guest['profilbild'] ?: "assets/standard_avatar.png"
    ];
}

// Rückgabe
echo json_encode([
    'status' => "success",
    'title' => $event['title'],
    'eingeladene' => $eingeladeneGruppiert
]);
