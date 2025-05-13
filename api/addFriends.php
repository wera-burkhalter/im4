<?php
session_start();
require_once(__DIR__ . '/../config.php');

$userId = $_SESSION['user_id'] ?? null;
$friendId = $_POST['friend_id'] ?? null;

if (!$userId || !$friendId || $userId == $friendId) {
    echo "Ungültige Anfrage.";
    exit;
}

// Doppelt speichern
$stmt = $pdo->prepare("INSERT IGNORE INTO friends (benutzer_id, freund_id) VALUES (:a, :b)");
$stmt->execute([':a' => $userId, ':b' => $friendId]);
$stmt->execute([':a' => $friendId, ':b' => $userId]);

echo "Freund erfolgreich hinzugefügt!";

