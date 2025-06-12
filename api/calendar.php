<?php
session_start();
require_once(__DIR__ . '/../config.php');
header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode([]);
    exit;
}

// Events laden, bei denen:
// - der Benutzer zugesagt hat (status = 'angenommen') ODER
// - der Benutzer selbst der Ersteller ist
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
  b.profilbild AS creator_profilbild,
  ehb.status
FROM events e
LEFT JOIN event_has_benutzer ehb ON e.id = ehb.event_id AND ehb.benutzer_id = :uid
JOIN benutzer b ON e.benutzer_id = b.id
WHERE 
  (ehb.status = 'angenommen' AND ehb.benutzer_id = :uid)
  OR e.benutzer_id = :uid
ORDER BY e.date ASC
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Zusätzliche Felder für die Anzeige vorbereiten
foreach ($events as &$event) {
    $event['creator_name'] = $event['creator_firstName'] . ' ' . $event['creator_surname'];
    $event['creator_image'] = !empty($event['creator_profilbild'])
        ? 'assets/uploads/' . $event['creator_profilbild']
        : 'assets/standard_avatar.png';
}
unset($event);

echo json_encode($events);