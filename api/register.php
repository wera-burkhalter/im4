<?php
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json; charset=UTF-8');

$phone = $_POST['phone'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$surname = $_POST['surname'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($phone) || empty($firstName) || empty($surname) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Bitte fülle alle Felder aus.']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Das Passwort muss mindestens 8 Zeichen lang sein.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE phone = :phone");
$stmt->execute([':phone' => $phone]);
if ($stmt->fetch()) {
    echo json_encode(['status' => 'error', 'message' => 'Diese Telefonnummer ist bereits registriert.']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$profilePicturePath = null;

// Profilbild verarbeiten
if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['profilePicture']['tmp_name'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tmpName);
    finfo_close($finfo);

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mimeType, $allowed)) {
        echo json_encode(['status' => 'error', 'message' => 'Nur JPG, PNG, GIF oder WEBP erlaubt.']);
        exit;
    }

    if ($_FILES['profilePicture']['size'] > 2 * 1024 * 1024) {
        echo json_encode(['status' => 'error', 'message' => 'Profilbild darf maximal 2 MB groß sein.']);
        exit;
    }

    $originalName = basename($_FILES['profilePicture']['name']);
    $newFileName = uniqid() . '_' . $originalName;
    $targetDir = __DIR__ . '/../uploads/';
    if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);

    if (!move_uploaded_file($tmpName, $targetDir . $newFileName)) {
        echo json_encode(['status' => 'error', 'message' => 'Fehler beim Speichern des Profilbilds.']);
        exit;
    }

    $profilePicturePath = 'uploads/' . $newFileName;
} else {
    echo json_encode(['status' => 'error', 'message' => 'Profilbild ist erforderlich.']);
    exit;
}

// Benutzer speichern
$insert = $pdo->prepare("
    INSERT INTO benutzer (phone, firstName, surname, password, profilbild)
    VALUES (:phone, :firstName, :surname, :pass, :bild)
");
$insert->execute([
    ':phone' => $phone,
    ':firstName' => $firstName,
    ':surname' => $surname,
    ':pass' => $hashedPassword,
    ':bild' => $profilePicturePath
]);

// Erfolgreiche Antwort
echo json_encode(['status' => 'success', 'message' => 'Registrierung erfolgreich!']);

