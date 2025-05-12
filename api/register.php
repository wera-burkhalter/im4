<?php
// Fehleranzeige aktivieren (für Entwicklung)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Datenbankverbindung laden
require_once(__DIR__ . '/../config.php');

// Antwort als Text
header('Content-Type: text/plain; charset=UTF-8');

// Formulardaten
$phone = $_POST['phone'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$surname = $_POST['surname'] ?? '';
$password = $_POST['password'] ?? '';

// Validierung der Eingabefelder
if (empty($phone) || empty($firstName) || empty($surname) || empty($password)) {
    echo "Bitte fülle alle Felder aus.";
    exit;
}

if (strlen($password) < 8) {
    echo "Das Passwort muss mindestens 8 Zeichen lang sein.";
    exit;
}

// Passwort hashen
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prüfen, ob Telefonnummer bereits existiert
$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE phone = :phone");
$stmt->execute([':phone' => $phone]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "Ein Benutzer mit dieser Telefonnummer existiert bereits.";
    exit;
}

// Bild-Upload & Validierung
$profilePicturePath = null;

if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['profilePicture']['tmp_name'];

    // MIME-Typ prüfen
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tmpName);
    finfo_close($finfo);

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mimeType, $allowedTypes)) {
        echo "Nur JPG, PNG, GIF oder WEBP Dateien sind erlaubt!";
        exit;
    }

    // Dateigröße prüfen (max. 2 MB)
    $maxSize = 2 * 1024 * 1024;
    if ($_FILES['profilePicture']['size'] > $maxSize) {
        echo "Die Datei ist zu groß. Maximal erlaubt: 2 MB.";
        exit;
    }

    // Dateipfad vorbereiten
    $originalName = basename($_FILES['profilePicture']['name']);
    $targetDir = __DIR__ . '/../uploads/';
    $newFileName = uniqid() . '_' . $originalName;
    $profilePicturePath = 'uploads/' . $newFileName;

    // Zielordner anlegen, falls nicht vorhanden
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Datei speichern
    move_uploaded_file($tmpName, $targetDir . $newFileName);
} else {
    echo "Fehler beim Hochladen des Profilbildes!";
    exit;
}

// In Datenbank einfügen
$insert = $pdo->prepare("INSERT INTO benutzer (phone, firstName, surname, password, profilbild) VALUES (:phone, :firstName, :surname, :pass, :bild)");
$insert->execute([
    ':phone' => $phone,
    ':firstName' => $firstName,
    ':surname' => $surname,
    ':pass' => $hashedPassword,
    ':bild' => $profilePicturePath
]);

// Erfolgreiche Rückmeldung
echo "Benutzer erfolgreich registriert!\n";
echo "Name: {$firstName} {$surname}\n";
echo "Telefon: {$phone}\n";
echo "Profilbild: {$profilePicturePath}\n";
