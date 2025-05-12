<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config.php');

header('Content-Type: text/plain; charset=UTF-8');

$email = $_POST['email'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($username) || empty($password)) {
    echo "Bitte fülle alle Felder aus.";
    exit;
}

if (strlen($password) < 8) {
    echo "Das Passwort muss mindestens 8 Zeichen lang sein.";
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE email = :email OR username = :username");
$stmt->execute([
    ':email' => $email,
    ':username' => $username
]);
$user = $stmt->fetch();

if ($user) {
    echo "Username oder E-Mail bereits vergeben.";
    exit;
} else {
    $insert = $pdo->prepare("INSERT INTO benutzer (username, email, password) VALUES (:username, :email, :pass)");
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


echo "User:", $user['email'];

$insert = $pdo->prepare("INSERT INTO benutzer (username, email, password) VALUES (:username, :email, :pass)");
$insert->execute([
    ':email' => $email,
    ':username' => $username,
    ':pass' => $hashedPassword
    ':bild' => $profilePicturePath
]);

echo "E-Mail: {$email}\n";
echo "Username: {$username}\n";
echo "Password: {$hashedPassword}\n";

?>