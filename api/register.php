<?php

require_once('../system/config.php');

header('Content-Type: text/plain; charset=UTF-8');

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$insert = $pdo->prepare("INSERT INTO benutzer (username, email, password) VALUES (:username, :email, :password)");
$insert->execute([
    ':username' => $username,
    ':email' => $email,
    ':password' => $password
]);

echo "Username: {$username}\n";
echo "E-Mail: {$email}\n";
echo "Password: {$password}\n";

?>