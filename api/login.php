<?php
// Fehleranzeige aktivieren (für Entwicklung)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    if (password_verify($password, $user['password'])) {
   
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['phone'] = $user['phone'];
        echo "Login erfolgreich!";
} else {
    echo "Passwort nicht korrekt";  
}

} else {
    echo "Telefonnummer nicht korrekt";
    exit;
}
