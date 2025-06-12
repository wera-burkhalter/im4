// alle Events des eingeloggten Benutzers laden
<?php
session_start();
require_once(__DIR__ . '/../config.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

// 1. Events des Users laden
$stmt = $pdo->prepare("
    SELECT id, title, date, place
    FROM events
    WHERE benutzer_id = ?
    ORDER BY date ASC
");
$stmt->execute([$userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 2. Für jedes Event eingeladene Freunde holen
foreach ($events as &$event) {
    $stmt = $pdo->prepare("
        SELECT b.firstName, b.surname, b.profilbild
        FROM event_has_benutzer e
        JOIN benutzer b ON e.benutzer_id = b.id
        WHERE e.event_id = ?
    ");
    $stmt->execute([$event['id']]);
    $freunde = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $event['avatars'] = array_map(function ($f) {
        return [
            "name" => $f['firstName'] . " " . $f['surname'],
            "profilbild" => $f['profilbild'] ?: "assets/standard_avatar.png"
        ];
    }, $freunde);
}

echo json_encode($events);
