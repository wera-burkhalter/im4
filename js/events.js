let currentUserId = null;

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// 1. Session prüfen & Profilbild setzen
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
      loadEvents();
    }
  });

async function loadEvents() {
  const container = document.createElement("div");
  container.className = "event-list";
  document.body.insertBefore(container, document.querySelector("nav"));

  try {
    const res = await fetch("api/myEvents.php");
    const events = await res.json();

    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.dataset.id = event.id;

      card.innerHTML = `
        <h3>${event.title}</h3>
        <div class="meta">${formatDate(event.date)} | ${event.place}</div>
        <div class="angefragt">
          Angefragt:
          <div class="avatars">
            ${event.avatars.map((a, i) =>
              i < 3
                ? `<img src="${a.profilbild}" title="${a.name}">`
                : ""
            ).join("")}
            ${event.avatars.length > 3 ? `<span class="plus-count">+${event.avatars.length - 3}</span>` : ""}
          </div>
        </div>
        <div class="delete" title="Event löschen">×</div>
      `;

      // Klick auf Karte → Details anzeigen
      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete")) {
          openDetailsModal(event.id);
        }
      });

      // Klick auf X → Löschen bestätigen
      card.querySelector(".delete").addEventListener("click", (e) => {
        e.stopPropagation();
        confirmDelete(event.id);
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Fehler beim Laden der Events:", err);
  }
}

function confirmDelete(eventId) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content centered">
      <span class="close">&times;</span>
      <p>Bist du sicher, dass du dieses Event absagen willst?</p>
      <button class="btn-delete">Ja</button>
      <button class="btn-cancel">Nein</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Klick ausserhalb schliesst Modal
  window.addEventListener("click", function handler(e) {
    if (e.target === modal) {
      modal.remove();
      window.removeEventListener("click", handler);
    }
  });


  modal.querySelector(".close").onclick = () => modal.remove();
  modal.querySelector(".btn-cancel").onclick = () => modal.remove();

  modal.querySelector(".btn-delete").onclick = async () => {
  try {
    const res = await fetch("api/deleteEvent.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ event_id: eventId })
    });

    const reply = await res.json();
    if (reply.status === "success") {
      modal.innerHTML = `
        <div class="modal-content centered">
          <p>Du hast das Event erfolgreich abgesagt.</p>
        </div>
      `;
      setTimeout(() => window.location.reload(), 2000);
    } else {
      alert("Fehler: " + reply.message);
    }
  } catch (err) {
    console.error("Fehler beim Löschen:", err);
  }
};

}

async function openDetailsModal(eventId) {
  try {
    const res = await fetch("api/getEventDetails.php?id=" + eventId);
    const data = await res.json();

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>${data.title}</h3>

        ${["angenommen", "abgelehnt", "vielleicht", "offen"].map(status => {
          const users = data.eingeladene[status];
          if (users.length === 0) return '';
          return `
            <div class="status-group">
              <h4>${status.charAt(0).toUpperCase() + status.slice(1)}</h4>
              ${users.map(user => `
                <div class="person">
                  <img src="${user.profilbild}" alt="">
                  <span>${user.name}</span>
                </div>
              `).join("")}
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Close-Button (X)
    modal.querySelector(".close").onclick = () => modal.remove();

    // Klick außerhalb schließt Modal
    window.addEventListener("click", function handler(e) {
      if (e.target === modal) {
        modal.remove();
        window.removeEventListener("click", handler);
      }
    });

    document.body.appendChild(modal);

  } catch (err) {
    console.error("Fehler beim Laden der Details:", err);
  }
}
