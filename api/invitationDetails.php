<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Nicht eingeloggt']);
    exit;
}

$userId = $_SESSION['user_id'];
$eventId = $_GET['id'] ?? null;

if (!$eventId) {
    echo json_encode(['status' => 'error', 'message' => 'Event-ID fehlt']);
    exit;
}

// Prüfen, ob der Nutzer eingeladen ist
$stmt = $pdo->prepare("SELECT status FROM event_has_benutzer WHERE event_id = ? AND benutzer_id = ?");
$stmt->execute([$eventId, $userId]);
$invite = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$invite) {
    echo json_encode(['status' => 'error', 'message' => 'Keine Einladung gefunden']);
    exit;
}

// Event-Daten inkl. Organisator laden
$stmt = $pdo->prepare("
    SELECT e.title, e.description, e.image, e.date, e.time, e.place, e.deadline,
           b.firstName AS organizerFirstName,
           b.surname AS organizerSurname,
           b.profilbild AS organizerProfilbild
    FROM events e
    JOIN benutzer b ON e.benutzer_id = b.id
    WHERE e.id = ?
");
$stmt->execute([$eventId]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$event) {
    echo json_encode(['status' => 'error', 'message' => 'Event nicht gefunden']);
    exit;
}

// Eingeladene Gäste
$stmt = $pdo->prepare("
    SELECT b.firstName, b.surname, b.profilbild
    FROM event_has_benutzer ehb
    JOIN benutzer b ON ehb.benutzer_id = b.id
    WHERE ehb.event_id = ?
");
$stmt->execute([$eventId]);
$guests = $stmt->fetchAll(PDO::FETCH_ASSOC);

$event['guests'] = array_map(function ($guest) {
    return [
        'name' => $guest['firstName'] . ' ' . $guest['surname'],
        'profilbild' => $guest['profilbild'] ?: 'assets/standard_avatar.png'
    ];
}, $guests);

// Status & Organizer strukturieren
$event['status'] = $invite['status'];
$event['organizer'] = [
    'name' => $event['organizerFirstName'] . ' ' . $event['organizerSurname'],
    'profilbild' => $event['organizerProfilbild'] ?: 'assets/standard_avatar.png'
];

// Aufräumen
unset($event['organizerFirstName'], $event['organizerSurname'], $event['organizerProfilbild']);

// JSON direkt ausgeben
echo json_encode($event);
