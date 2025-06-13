<?php
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json; charset=UTF-8');

$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';

// Nutzer aus DB holen
$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE phone = :phone");
$stmt->execute([':phone' => $phone]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'Telefonnummer nicht korrekt']);
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Passwort nicht korrekt']);
    exit;
}

// Login erfolgreich → Session starten
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['phone'] = $user['phone'];
$_SESSION['firstName'] = $user['firstName'];
$_SESSION['profilbild'] = $user['profilbild'];

echo json_encode(['status' => 'success']);
