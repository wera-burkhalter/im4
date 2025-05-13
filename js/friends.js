console.log("friends.js loaded");

fetch("api/protected.php")
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "error") {
      window.location.href = "login.html";
      return;
    }

    // Profilbild anzeigen
    document.getElementById("profilbild").src = data.profilbild || "assets/standard_avatar.png";

    // Freunde laden
    fetch("api/friends.php")
      .then((res) => res.json())
      .then((freunde) => {
        const liste = document.getElementById("freundeListe");

        freunde.forEach((freund) => {
          const div = document.createElement("div");
          div.className = "freund-box";

          div.innerHTML = `
            <img src="${freund.profilbild}" alt="Profilbild">
            <span>${freund.firstName} ${freund.surname}</span>
            <form method="POST" action="api/freunde_entfernen.php" onsubmit="return confirm('Wirklich entfernen?')">
              <input type="hidden" name="freund_id" value="${freund.id}">
              <button type="submit" class="entfernen-button">entfernen</button>
            </form>
          `;

          liste.appendChild(div);
        });
      });
  })
  .catch((err) => console.error("Fehler:", err));
