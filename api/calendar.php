<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode([]);
    exit;
}

// Events, die der Benutzer selbst erstellt hat oder wo er teilnimmt
$sql = "
SELECT e.*, b.firstName AS creatorFirstName, b.surname AS creatorSurname, b.profilbild AS creatorImage
FROM events e
LEFT JOIN event_has_benutzer ehb ON e.id = ehb.event_id
LEFT JOIN benutzer b ON e.benutzer_id = b.id
WHERE e.benutzer_id = :uid OR (ehb.benutzer_id = :uid AND ehb.status = 'accepted')
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events);