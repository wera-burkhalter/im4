<?php
// invitations.php
session_start();
require_once(__DIR__ . '/../config.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$userId = $_SESSION['user_id'];

// Events, zu denen der Benutzer eingeladen wurde und noch nicht zugesagt oder abgesagt hat
$stmt = $pdo->prepare("SELECT e.id, e.title, e.date, e.place, e.deadline, b.firstName, b.surname, b.profilbild
                       FROM event_has_benutzer ehb
                       JOIN events e ON e.id = ehb.event_id
                       JOIN benutzer b ON e.benutzer_id = b.id
                       WHERE ehb.benutzer_id = ? AND ehb.status = 'offen'
                       ORDER BY e.date ASC");
$stmt->execute([$userId]);
$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events);
