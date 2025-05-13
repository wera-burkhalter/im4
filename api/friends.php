<?php
session_start();
require_once(__DIR__ . '/../config.php');

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT b.id, b.firstName, b.surname, b.profilbild
    FROM friends f
    JOIN benutzer b ON f.freund_id = b.id
    WHERE f.benutzer_id = :uid
");
$stmt->execute([':uid' => $userId]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

let selectedFriendId = null;

// Öffnen des Popups
function openRemovePopup(friendId, fullName) {
  selectedFriendId = friendId;
  document.getElementById("removeMessage").innerText =
    `Bist du sicher, dass du ${fullName} entfernen willst?`;
  document.getElementById("removeConfirmModal").style.display = "block";
}

// Schließen (abbrechen)
document.getElementById("cancelRemoveBtn").addEventListener("click", () => {
  document.getElementById("removeConfirmModal").style.display = "none";
  selectedFriendId = null;
});

// Bestätigen
document.getElementById("confirmRemoveBtn").addEventListener("click", () => {
  if (!selectedFriendId) return;

  fetch("api/removeFriends.php", {
    method: "POST",
    body: new URLSearchParams({ freund_id: selectedFriendId }),
  })
    .then(res => res.text())
    .then(msg => {
      console.log("Antwort:", msg);
      document.getElementById("removeConfirmModal").style.display = "none";
      selectedFriendId = null;
      loadFriends(); // Liste aktualisieren
    });
});