<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT 
    e.id,
    e.title,
    e.date,
    e.time,
    e.place,
    e.image,
    e.deadline,
    e.description,
    e.benutzer_id AS creator_id,
    b.firstName || ' ' || b.surname AS creator_name,
    b.profilbild AS creator_image
FROM events e
JOIN event_has_benutzer ehb ON e.id = ehb.event_id
JOIN benutzer b ON e.benutzer_id = b.id
WHERE ehb.benutzer_id = :uid AND ehb.status = 'zugesagt'
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $userId]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
