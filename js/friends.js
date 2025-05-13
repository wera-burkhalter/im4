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


  const modal = document.getElementById("addFriendModal");
const btn = document.getElementById("addFriendBtn");
const closeBtn = document.querySelector(".close-btn");
const searchBtn = document.getElementById("searchFriendBtn");
const confirmBtn = document.getElementById("addFriendConfirmBtn");

const phoneInput = document.getElementById("friendPhone");
const message = document.getElementById("addFriendMessage");

const previewBox = document.getElementById("friendPreview");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");

let currentFriendId = null;

// Modal öffnen/schließen
btn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Freund suchen
searchBtn.onclick = () => {
  const phone = phoneInput.value.trim();
  previewBox.style.display = "none";
  message.textContent = "";

  if (!phone) {
    message.textContent = "Bitte Telefonnummer eingeben.";
    return;
  }

  fetch("api/searchFriends.php", {
    method: "POST",
    body: new URLSearchParams({ phone }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "not_found") {
        message.textContent = "Benutzer nicht gefunden.";
      } else if (data.status === "self") {
        message.textContent = "Du kannst dich nicht selbst hinzufügen.";
      } else {
        currentFriendId = data.id;
        previewImage.src = data.profilbild;
        previewName.textContent = `${data.firstName} ${data.surname}`;
        previewBox.style.display = "flex";
      }
    })
    .catch(() => message.textContent = "Fehler bei der Suche.");
};

// Anfrage senden
confirmBtn.onclick = () => {
  if (!currentFriendId) return;

  fetch("api/addFriends.php", {
    method: "POST",
    body: new URLSearchParams({ friend_id: currentFriendId }),
  })
    .then(res => res.text())
    .then(txt => {
      message.textContent = txt;
      previewBox.style.display = "none";
      phoneInput.value = "";
    });
};
