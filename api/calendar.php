<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode([]);
    exit;
}

// Nur Events, bei denen der eingeloggte User zugesagt hat
$sql = "
SELECT e.*, b.firstName AS creatorFirstName, b.surname AS creatorSurname, b.profilbild AS creatorImage
FROM events e
JOIN event_has_benutzer ehb ON e.id = ehb.event_id
JOIN benutzer b ON e.benutzer_id = b.id
WHERE ehb.benutzer_id = :uid
  AND ehb.status = 'angenommen'
ORDER BY e.date, e.time
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events);