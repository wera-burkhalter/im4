<?php
session_start();
require_once(__DIR__ . '/../config.php');
header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode([]);
    exit;
}

// Nur Events mit Status "angenommen" für diesen Benutzer
$sql = "
SELECT 
  e.id,
  e.title,
  e.date,
  e.time,
  e.place,
  e.image,
  e.description,
  e.benutzer_id AS creator_id,
  b.firstName AS creator_firstName,
  b.surname AS creator_surname,
  b.profilbild AS creator_profilbild
FROM events e
JOIN event_has_benutzer ehb ON e.id = ehb.event_id
JOIN benutzer b ON e.benutzer_id = b.id
WHERE ehb.benutzer_id = :uid AND ehb.status = 'angenommen'
ORDER BY e.date ASC
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Ergänzungen für JS
foreach ($events as &$event) {
    $event['creator_name'] = $event['creator_firstName'] . ' ' . $event['creator_surname'];
    $event['creator_image'] = !empty($event['creator_profilbild'])
        ? 'assets/uploads/' . $event['creator_profilbild']
        : 'assets/standard_avatar.png';
}
unset($event);

echo json_encode($events);