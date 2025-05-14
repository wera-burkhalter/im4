let currentDate = new Date();
let allEventDates = []; // Array der Event-Daten im Format "YYYY-MM-DD"

// =============================
// INIT: Session + Events + Kalender
// =============================
document.addEventListener("DOMContentLoaded", () => {
  ladeSession();
  ladeEvents();
  renderCalendar();
});

// =============================
// 1. Sessiondaten laden (Profilbild)
// =============================
function ladeSession() {
  fetch("api/protected.php")
    .then(res => res.json())
    .then(data => {
      if (data.profilbild) {
        document.getElementById("profilbild").src = data.profilbild;
      }
    });
}

// =============================
// 2. Events vom Server laden
// =============================
function ladeEvents() {
  fetch("api/calendar.php")
    .then(res => res.json())
    .then(data => {
      allEventDates = data.map(event => event.date); // Array: ["2025-05-16", ...]
      renderCalendar();
    });
}

// =============================
// 3. Kalender generieren
// =============================
function renderCalendar() {
  const grid = document.getElementById("kalenderGrid");
  const monthYear = document.getElementById("monthYear");
  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = currentDate.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const startDay = (firstDay + 6) % 7;
  for (let i = 0; i < startDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const tag = document.createElement("div");
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    tag.textContent = String(day).padStart(2, "0");
    if (allEventDates.includes(dateStr)) tag.classList.add("event-tag");

    tag.addEventListener("click", () => {
      document.querySelectorAll(".active-date").forEach(e => e.classList.remove("active-date"));
      tag.classList.add("active-date");
      zeigeEventPreview(dateStr);
    });

    grid.appendChild(tag);
  }
}

// Monat vor/zurück

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

// =============================
// 4. Events anzeigen unter dem Kalender
// =============================
function zeigeEventPreview(dateStr) {
  fetch(`api/calendar.php?date=${dateStr}`)
    .then(res => res.json())
    .then(events => {
      const container = document.getElementById("eventPreviewContainer");
      container.innerHTML = "";

      events.forEach(evt => {
        const card = document.createElement("div");
        card.className = "event-preview-card";
        card.innerHTML = `
          <h3>${evt.title}</h3>
          <p>${evt.date} | ${evt.place}</p>
          <p><img src="${evt.creatorImage}" alt="Ersteller" style="width:30px; border-radius:50%;"> ${evt.creatorName}</p>
        `;
        card.onclick = () => zeigeDetail(evt.id);
        container.appendChild(card);
      });
    });
}

// =============================
// 5. Detailansicht (Pop-up)
// =============================
function zeigeDetail(eventId) {
  fetch(`api/calendar.php?event_id=${eventId}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("eventDetails").innerHTML = html;
      document.getElementById("eventModal").style.display = "block";
    });
}

document.querySelector(".close-btn").onclick = () => {
  document.getElementById("eventModal").style.display = "none";
};