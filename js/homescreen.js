// ========================
// 1. SESSIONDATEN HOLEN
// ========================
fetch("api/protected.php")
  .then(res => res.json())
  .then(data => {
    if (data.status === "error") {
      window.location.href = "login.html";
    } else {
      currentUserId = data.user_id;
      if (data.profilbild) {
        document.getElementById("profilbild").src = data.profilbild;
      }
      // ladeFreunde(); // Entfernen oder aktivieren je nach Bedarf
    }
  });

// ========================
// 2. LOGOUT-FUNKTION
// ========================
function logout() {
  fetch("api/logout.php")
    .then(() => {
      window.location.href = "index.html";
    });
}
