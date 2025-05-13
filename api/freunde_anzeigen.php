<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT b.id, b.firstName, b.surname, b.profilbild
    FROM friends f
    JOIN benutzer b ON f.freund_id = b.id
    WHERE f.benutzer_id = :id
");
$stmt->execute([':id' => $userId]);
$freunde = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($freunde);
