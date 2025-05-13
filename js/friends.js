console.log("friends.js geladen");

const profilbild = document.getElementById("profilbild");
const freundeListe = document.getElementById("freundeListe");
const message = document.getElementById("addFriendMessage");

let currentFriendId = null;

// =============================
// 1. SESSIONDATEN LADEN (User-Profilbild etc.)
// =============================
fetch("api/protected.php")
  .then((res) => {
    if (!res.ok) throw new Error("Antwortstatus nicht OK");
    return res.json();
  })
  .then((data) => {
  if (data.status === "error") {
    window.location.href = "login.html";
  } else {
    if (data.profilbild && profilbild) {
      profilbild.src = data.profilbild;
    }
    ladeFreunde(); // <- WICHTIG!
  }
})
  .catch((err) => {
    console.error("Fehler beim Laden der Sessiondaten:", err);
    alert("Fehler beim Laden. Bitte neu einloggen.");
  });

// =============================
// 2. FREUNDE LADEN
// =============================
function ladeFreunde() {
  fetch("api/freunde_anzeigen.php")
    .then((res) => res.json())
    .then((freunde) => {
      freundeListe.innerHTML = ""; // Liste leeren
      freunde.forEach((freund) => {
        const box = document.createElement("div");
        box.classList.add("freund-box");

        box.innerHTML = `
          <img src="${freund.profilbild}" alt="${freund.firstName}">
          <span>${freund.firstName} ${freund.surname}</span>
          <button class="entfernen-button" data-id="${freund.id}">entfernen</button>
        `;

        freundeListe.appendChild(box);
      });

      // Entfernen-Buttons
      document.querySelectorAll(".entfernen-button").forEach((btn) => {
       btn.addEventListener("click", () => {
  const id = btn.getAttribute("data-id");
  const name = btn.closest(".freund-box").querySelector("span").innerText;
  openRemovePopup(id, name);
});
      });
    });
}

// =============================
// 3. FREUND ENTFERNEN
// =============================
function entferneFreund(id) {
  fetch("api/removeFriends.php", {
    method: "POST",
    body: new URLSearchParams({ id }),
  })
    .then((res) => res.text())
    .then((message) => {
      ladeFreunde();
      const feedback = document.getElementById("removeFeedback");
      if (feedback) {
        feedback.textContent = message;
        setTimeout(() => {
          feedback.textContent = "";
        }, 3000);
      }
    })
    .catch((err) => console.error("Fehler beim Entfernen:", err));
}

// =============================
// 4. MODAL HANDLING
// =============================
const modal = document.getElementById("addFriendModal");
const btn = document.getElementById("addFriendBtn");
const closeBtn = document.querySelector(".close-btn");
const searchBtn = document.getElementById("searchFriendBtn");
const confirmBtn = document.getElementById("addFriendConfirmBtn");

const phoneInput = document.getElementById("friendPhone");
const previewBox = document.getElementById("friendPreview");
const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");

// Modal öffnen/schließen
btn.onclick = () => {
  modal.style.display = "block";
  previewBox.style.display = "none";
  message.textContent = "";
  phoneInput.value = "";
};

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// =============================
// 5. FREUND SUCHEN
// =============================
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
    .then((res) => res.json())
    .then((data) => {
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
    .catch(() => (message.textContent = "Fehler bei der Suche."));
};

// =============================
// 6. FREUND ANFRAGEN
// =============================
confirmBtn.onclick = () => {
  if (!currentFriendId) return;

  fetch("api/freunde_hinzufuegen.php", {
    method: "POST",
    body: new URLSearchParams({ friend_id: currentFriendId }),
  })
    .then((res) => res.text())
    .then((txt) => {
      message.textContent = txt;
      previewBox.style.display = "none";
      ladeFreunde(); // Liste neu laden
    });
};

// =============================
// 7. FREUND ENTFERNEN POPUP
// =============================
let selectedFriendId = null;

function openRemovePopup(friendId, fullName) {
  selectedFriendId = friendId;
  document.getElementById("removeMessage").innerText = `Bist du sicher, dass du ${fullName} entfernen willst?`;
  document.getElementById("removeConfirmModal").style.display = "block";
}

document.getElementById("cancelRemoveBtn").addEventListener("click", () => {
  document.getElementById("removeConfirmModal").style.display = "none";
  selectedFriendId = null;
});

document.getElementById("confirmRemoveBtn").addEventListener("click", () => {
  if (!selectedFriendId) return;

  fetch("api/removeFriends.php", {
    method: "POST",
    body: new URLSearchParams({ id: selectedFriendId }),
  })
    .then(res => res.text())
    .then(msg => {
      // Erfolgsmeldung anzeigen
      const feedback = document.getElementById("removeFeedback");
      if (feedback) {
        feedback.textContent = msg;
        setTimeout(() => {
          feedback.textContent = "";
        }, 3000);
      }

      ladeFreunde(); // Liste neu laden
      document.getElementById("removeConfirmModal").style.display = "none";
      selectedFriendId = null;
    })
    .catch((err) => console.error("Fehler beim Entfernen:", err));
});

