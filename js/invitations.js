// invitations.js
let currentUserId = null;

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ========== SESSION PRÜFEN ==========
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
      loadInvitations();
    }
  });

// ========== EINLADUNGEN LADEN ==========
async function loadInvitations() {
  try {
    const res = await fetch("api/invitations.php");
    const events = await res.json();

    const list = document.createElement("div");// invitations.js
let currentUserId = null;

// ========== SESSION PRÜFEN ==========
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
      loadInvitations();
    }
  });

// ========== EINLADUNGEN LADEN ==========
async function loadInvitations() {
  try {
    const res = await fetch("api/invitations.php");
    const events = await res.json();

    const list = document.createElement("div");
    list.className = "event-list";
    document.body.insertBefore(list, document.querySelector("nav"));

    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "invite-card";
      card.innerHTML = `
        <h3>${event.title}</h3>
        <div class="meta">${formatDate(event.date)} | ${event.place}</div>
        <div class="organizer">
          <img src="${event.organizer.profilbild}" alt="">
          ${event.organizer.name}
        </div>
        <div class="deadline">Frist: <strong>${formatDate(event.deadline)}</strong></div>
      `;
      card.addEventListener("click", () => showDetails(event.id));
      list.appendChild(card);
    });
  } catch (err) {
    console.error("Fehler beim Laden der Einladungen:", err);
  }
}

// ========== DETAILS ANZEIGEN ==========
async function showDetails(eventId) {
  try {
    const res = await fetch("api/invitationDetails.php?id=" + eventId);
    const data = await res.json();

    const modal = document.getElementById("detailModal");
    const content = document.getElementById("detailContent");
    modal.classList.remove("hidden");

    // Gäste-Bilder HTML erzeugen
    const guestsHTML = data.guests.map(g => `<img src="${g.profilbild}" title="${g.name}">`).join("");

    content.innerHTML = `
      <h3>${data.title}</h3>
      <img class="cover" src="${data.image}" alt="Event-Bild">
      <div class="meta">${formatDate(data.date)} | ${data.place}</div>
      <div class="time">ab ${data.time} Uhr</div>
      <p>${data.description}</p>
      <div class="avatars">${guestsHTML}</div>
      <div class="organizer">
        <img src="${data.organizer.profilbild}" alt=""> ${data.organizer.name}
      </div>
      <div class="response-buttons">
        <button class="yes">✔ zusagen</button>
        <button class="maybe">? evtl.</button>
        <button class="no">✖ absagen</button>
      </div>
    `;

    // Event-Buttons
    content.querySelector(".yes").onclick = () => handleResponse(eventId, "angenommen");
    content.querySelector(".maybe").onclick = () => handleResponse(eventId, "vielleicht");
    content.querySelector(".no").onclick = () => handleResponse(eventId, "abgelehnt");

    // Close-Button
    modal.querySelector(".close").onclick = () => modal.classList.add("hidden");

  } catch (err) {
    console.error("Fehler beim Anzeigen der Details:", err);
  }
}

// ========== ANTWORT HANDLING ==========
function handleResponse(eventId, status) {
  const confirmModal = document.getElementById("confirmModal");
  const confirmText = document.getElementById("confirmText");
  const successModal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");

  const messageMap = {
    angenommen: "diesem Event zusagen",
    abgelehnt: "diesem Event absagen",
    vielleicht: "diesem Event evtl. zusagen"
  };

  confirmText.textContent = `Bist du sicher, dass du ${messageMap[status]} willst?`;
  confirmModal.classList.remove("hidden");

  document.getElementById("confirmYes").onclick = async () => {
    confirmModal.classList.add("hidden");

    try {
      const res = await fetch("api/respondInvitation.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, status })
      });
      const reply = await res.json();

      if (reply.status === "success") {
        successMessage.textContent =
          status === "angenommen"
            ? "Du hast erfolgreich zugesagt."
            : status === "abgelehnt"
              ? "Du wurdest erfolgreich von diesem Event abgemeldet."
              : "Deine Antwort wurde gespeichert.";

        successModal.classList.remove("hidden");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert("Fehler: " + reply.message);
      }
    } catch (err) {
      console.error("Fehler beim Antworten:", err);
    }
  };

  document.getElementById("confirmNo").onclick = () => {
    confirmModal.classList.add("hidden");
  };
}

    list.className = "event-list";
    document.body.insertBefore(list, document.querySelector("nav"));

    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "invite-card";
      card.innerHTML = `
        <h3>${event.title}</h3>
        <div class="meta">${event.date} | ${event.place}</div>
        <div class="organizer">
          <img src="${event.organizer.profilbild}" alt="">
          ${event.organizer.name}
        </div>
        <div class="deadline">Frist: <strong>${event.deadline}</strong></div>
      `;
      card.addEventListener("click", () => showDetails(event.id));
      list.appendChild(card);
    });
  } catch (err) {
    console.error("Fehler beim Laden der Einladungen:", err);
  }
}

// ========== DETAILS ANZEIGEN ==========
async function showDetails(eventId) {
  try {
    const res = await fetch("api/invitationDetails.php?id=" + eventId);
    const data = await res.json();

    const modal = document.getElementById("detailModal");
    const content = document.getElementById("detailContent");
    modal.classList.remove("hidden");

    // Gäste-Bilder HTML erzeugen
    const guestsHTML = data.guests.map(g => `<img src="${g.profilbild}" title="${g.name}">`).join("");

    content.innerHTML = `
      <h3>${data.title}</h3>
      <img class="cover" src="${data.image}" alt="Event-Bild">
      <div class="meta">${formatDate(data.date)} | ${data.place}</div>
      <div class="time">ab ${data.time} Uhr</div>
      <p>${data.description}</p>
      <div class="avatars">${guestsHTML}</div>
      <div class="organizer">
        <img src="${data.organizer.profilbild}" alt=""> ${data.organizer.name}
      </div>
      <div class="response-buttons">
        <button class="yes">✔ zusagen</button>
        <button class="maybe">? evtl.</button>
        <button class="no">✖ absagen</button>
      </div>
    `;

    // Event-Buttons
    content.querySelector(".yes").onclick = () => handleResponse(eventId, "angenommen");
    content.querySelector(".maybe").onclick = () => handleResponse(eventId, "vielleicht");
    content.querySelector(".no").onclick = () => handleResponse(eventId, "abgelehnt");

    // Close-Button
    modal.querySelector(".close").onclick = () => modal.classList.add("hidden");

  } catch (err) {
    console.error("Fehler beim Anzeigen der Details:", err);
  }
}


// ========== ANTWORT HANDLING ==========
function handleResponse(eventId, status) {
  const modal = document.createElement("div");
  modal.className = "modal";
  const messageMap = {
    angenommen: "diesem Event zusagen",
    abgelehnt: "diesem Event absagen",
    vielleicht: "diesem Event evtl. zusagen"
  };
  modal.innerHTML = `
    <div class="modal-content">
      <p>Bist du sicher, dass du ${messageMap[status]} willst?</p>
      <button class="btn-delete" id="confirm">ja</button>
      <button class="btn-cancel" id="cancel">nein</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#cancel").onclick = () => modal.remove();
  modal.querySelector("#confirm").onclick = async () => {
    try {
      const res = await fetch("api/respondInvitation.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, status })
      });
      const reply = await res.json();

      if (reply.status === "success") {
        modal.innerHTML = `<div class="modal-content">${
          status === "angenommen"
            ? "Du hast erfolgreich zugesagt."
            : status === "abgelehnt"
              ? "Du wurdest erfolgreich von diesem Event abgemeldet."
              : "Deine Antwort wurde gespeichert."
        }</div>`;
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert("Fehler: " + reply.message);
      }
    } catch (err) {
      console.error("Fehler beim Antworten:", err);
    }
  };
}
