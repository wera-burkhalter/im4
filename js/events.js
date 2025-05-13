console.log("events.js loaded");

fetch("api/events.php")
  .then((res) => res.json())
  .then((data) => {
    if (data.status !== "success") {
      window.location.href = "login.html";
      return;
    }

    // Profilbild setzen
    const profilbild = document.querySelector(".profilbild");
    if (profilbild && data.profilbild) {
      profilbild.src = data.profilbild;
    }

    const container = document.querySelector(".eventliste");

    data.events.forEach(event => {
      const card = document.createElement("div");
      card.classList.add("eventkarte");

      // HTML-Inhalt einfügen
      card.innerHTML = `
        <div class="event-header">
          <h2>${event.title}</h2>
          <button class="delete">✕</button>
        </div>
        <p>${event.date} | ${event.place}</p>
        <div class="teilnehmer">
          <span>Angefragt:</span>
          <div class="avatars">
            ${event.anfragen.map(a => `<img src="${a.profilbild}" alt="${a.firstName}" />`).join('')}
            ${event.anfrage_anzahl > 3 ? `<span>+${event.anfrage_anzahl - 3}</span>` : ""}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Fehler beim Laden der Events:", err);
  });
