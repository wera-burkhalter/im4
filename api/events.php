<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => "error", "message" => "Nicht eingeloggt"]);
    exit;
}

$benutzer_id = $_SESSION['user_id'];

/* Pflichtfelder prüfen */
$required = ['title', 'description', 'date', 'place', 'deadline'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(["status" => "error", "message" => "Feld $field ist leer"]);
        exit;
    }
}

/* Optionale Felder */
$time = $_POST['time'] ?? '';
$imagePath = null;

/* Bild hochladen */
$imagePath = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($_FILES['image']['type'], $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Nur Bildformate sind erlaubt."]);
        exit;
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = uniqid("event_") . "." . $ext;
    $uploadDir = __DIR__ . "/../uploads/events/";
    $uploadPath = $uploadDir . $filename;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
        echo json_encode(["status" => "error", "message" => "Fehler beim Speichern des Bildes."]);
        exit;
    }

    $imagePath = "uploads/events/" . $filename;
}


/* Event speichern */
$stmt = $pdo->prepare("
    INSERT INTO events (benutzer_id, image, title, description, date, time, place, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $benutzer_id,
    $imagePath,
    $_POST['title'],
    $_POST['description'],
    $_POST['date'],
    $time,
    $_POST['place'],
    $_POST['deadline']
]);

echo json_encode(["status" => "success"]);
