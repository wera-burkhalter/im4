// invitations.js
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
    const modal = document.createElement("div");
    modal.className = "modal";

    const guestsHTML = data.guests.map(g => `<img src="${g.profilbild}" title="${g.name}">`).join("");

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>${data.title}</h3>
        <img class="event-image" src="${data.image}" alt="Event-Bild">
        <div class="meta">${data.date} | ${data.place}</div>
        <div class="time">ab ${data.time} Uhr</div>
        <p>${data.description}</p>
        <div class="guests">${guestsHTML}</div>
        <div class="organizer">
          <img src="${data.organizer.profilbild}" alt=""> ${data.organizer.name}
        </div>
        <div class="buttons">
          <button class="btn green" onclick="handleResponse(${eventId}, 'angenommen')">✔ zusagen</button>
          <button class="btn blue" onclick="handleResponse(${eventId}, 'vielleicht')">? evtl.</button>
          <button class="btn red" onclick="handleResponse(${eventId}, 'abgelehnt')">✖ absagen</button>
        </div>
      </div>
    `;

    modal.querySelector(".close").onclick = () => modal.remove();
    document.body.appendChild(modal);

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
