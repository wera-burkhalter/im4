<?php
session_start();
require_once(__DIR__ . '/../config.php');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo "Nicht eingeloggt.";
    exit;
}

$currentUserId = $_SESSION['user_id'];
$friendId = $_POST['id'] ?? null;

if (!$friendId || !is_numeric($friendId)) {
    http_response_code(400);
    echo "Ungültige Freund-ID.";
    exit;
}

// Hole den Namen des Freundes vor dem Löschen
$stmtName = $pdo->prepare("SELECT firstName, surname FROM benutzer WHERE id = :id");
$stmtName->execute([':id' => $friendId]);
$freund = $stmtName->fetch();

if (!$freund) {
    echo "Benutzer nicht gefunden.";
    exit;
}

$name = $freund['firstName'] . ' ' . $freund['surname'];

// Lösche die Freundschaft in beide Richtungen
$stmt = $pdo->prepare("DELETE FROM friends WHERE 
    (benutzer_id = :me AND freund_id = :friend)
    OR (benutzer_id = :friend AND freund_id = :me)
");

$stmt->execute([
    ':me' => $currentUserId,
    ':friend' => $friendId
]);

echo "$name wurde erfolgreich entfernt.";

