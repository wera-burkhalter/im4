<?php

require_once(__DIR__ . '/../config.php');

header('Content-Type: text/plain; charset=UTF-8');

// Formulardaten
$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';

// Validierung der Eingabefelder
echo "Habe folgende Daten erhalten, phone: $phone\n, Passwort: $password\n";

// Prüfen, ob Telefonnummer bereits existiert
$stmt = $pdo->prepare("SELECT * FROM benutzer WHERE phone = :phone");
$stmt->execute([':phone' => $phone]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "Telefon gefunden, jetzt Passwort prüfen";

} else {
    echo "Telefon nicht korrekt";
    
}
