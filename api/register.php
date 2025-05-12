<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config.php');

header('Content-Type: text/plain; charset=UTF-8');

$phone = $_POST['phone'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$surname = $_POST['surname'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($phone) || empty($firstName) || empty($surname) || empty($password)) {
    echo "Bitte fülle alle Felder aus.";
    exit;
}

if (strlen($password) < 8) {
    echo "Das Passwort muss mindestens 8 Zeichen lang sein.";
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE phone = :phone");
$stmt->execute([
    ':phone' => $phone
]);
$user = $stmt->fetch();

if ($user) {
    echo "Ein Benutzer mit dieser Telefonnummer existiert bereits.";
    exit;
} 

$profilePicturePath = null;

if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['profilePicture']['tmp_name'];
    $originalName = basename($_FILES['profilePicture']['name']);
    $targetDir = __DIR__ . '/../uploads/';
    $newFileName = uniqid() . '_' . $originalName;
    $profilePicturePath = 'uploads/' . $newFileName;

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    move_uploaded_file($tmpName, $targetDir . $newFileName);
} else {
    echo "Fehler beim Hochladen des Profilbildes!";
    exit;
}


$insert = $pdo->prepare("INSERT INTO benutzer (phone, firstName, surname, password, profilbild) VALUES (:phone, :firstName, :surname, :pass, :bild)");
$insert->execute([
    ':phone' => $phone,
    ':firstName' => $firstName,
    ':surname' => $surname,
    ':pass' => $hashedPassword,
    ':bild' => $profilePicturePath
]);

echo "Benutzer erfolgreich registriert!\n";
echo "Profilbild: {$profilePicturePath}\n";
echo "Handy-Nr.: {$phone}\n";
echo "Name: {$firstName} {$surname}\n";
?>