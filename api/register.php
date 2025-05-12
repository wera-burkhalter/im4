<?php

header ('Content-Type: text/plain; charset=UFT-8');

$username = $_Post ['username'] ??'';
$email = $_Post ['email'] ??'';
$password = $_Post ['password'] ??'';

echo "Username: {$username}\n";
echo "E-Mail: {$email}\n";
echo "Password: {$password}\n";

?>