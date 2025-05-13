<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
$phone = $_POST['phone'] ?? '';

if (!$userId || !$phone) {
    echo json_encode(["status" => "error"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, firstName, surname, profilbild FROM benutzer WHERE phone = :phone LIMIT 1");
$stmt->execute([':phone' => $phone]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["status" => "not_found"]);
    exit;
}

if ($user['id'] == $userId) {
    echo json_encode(["status" => "self"]);
    exit;
}

echo json_encode([
    "status" => "found",
    "id" => $user['id'],
    "firstName" => $user['firstName'],
    "surname" => $user['surname'],
    "profilbild" => $user['profilbild']
]);
