<?php

require_once(__DIR__ . '/../config.php');

header('Content-Type: text/plain; charset=UTF-8');

// Formulardaten
$loginInfo = $_POST['loginInfo'] ?? '';
$password = $_POST['password'] ?? '';

// Validierung der Eingabefelder
echo "Habe folgende Daten erhalten, LoginInfo:
$loginInfo, Passwort: $password\n";