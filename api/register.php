<?php

header('Content-Type: text/plain; charset=UTF-8');

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

echo "Username: {$username}\n";
echo "E-Mail: {$email}\n";
echo "Password: {$password}\n";

?>