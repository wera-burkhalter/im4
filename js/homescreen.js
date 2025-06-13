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
      profilbild.src = data.profilbild;
    }
    ladeFreunde(); // ✅ Hier war der Fehler
  }
});

document.getElementById("logoutButton").addEventListener("click", () => {
  fetch("api/logout.php")
    .then(() => {
      window.location.href = "index.html";
    });
});