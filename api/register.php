<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config.php');

header('Content-Type: text/plain; charset=UTF-8');

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';


$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare("INSERT INTO benutzer (username, email, password) VALUES (:username, :email, :pass)");
$insert->execute([
    ':username' => $username,
    ':email' => $email,
    ':pass' => $hashedPassword
]);

echo "Username: {$username}\n";
echo "E-Mail: {$email}\n";
echo "Password: {$hashedPassword}\n";

?>