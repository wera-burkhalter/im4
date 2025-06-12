console.log("calendar.js geladen");

let currentDate = new Date();
let allEvents = [];
let currentUserId = null;

const profilbild = document.getElementById("profilbild");
const monthYearDisplay = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const calendarDates = document.getElementById("calendarDates");
const eventPreviewContainer = document.getElementById("eventPreviewContainer");

const modal = document.getElementById("eventDetailModal");
const closeModalBtn = document.getElementById("closeDetailModal");
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const abmeldenBtn = document.getElementById("abmeldenBtn");

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

// Session prüfen und Events laden
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
      loadEvents();
    }
  });

function loadEvents() {
  fetch("api/calendar.php")
    .then(res => res.json())
    .then(data => {
      allEvents = data;
      renderCalendar();
    });
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

  calendarDays.innerHTML = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"].map(d => `<div class="calendar-day">${d}</div>`).join("");
  calendarDates.innerHTML = "";

  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) {
    calendarDates.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEvent = allEvents.some(e => e.date === dateStr);

    const div = document.createElement("div");
    div.textContent = String(day).padStart(2, '0');
    div.className = hasEvent ? "event-day calendar-date" : "calendar-date";

    if (hasEvent) {
      div.addEventListener("click", () => showEventPreview(dateStr));
    }

    calendarDates.appendChild(div);
  }
}

function showEventPreview(date) {
  const events = allEvents.filter(e => e.date === date);

  document.querySelectorAll(".event-day").forEach(d => d.classList.remove("selected-day"));
  const selectedDiv = [...calendarDates.children].find(div =>
    div.textContent === date.slice(-2) && div.classList.contains("event-day"));
  if (selectedDiv) selectedDiv.classList.add("selected-day");

  eventPreviewContainer.innerHTML = events.map(e => {
    const showCreatorInfo = e.creator_id != currentUserId;
    return `
      <div class="event-preview" onclick="showEventDetail(${e.id})">
        <h3>${e.title}</h3>
        <p class="event-meta">${formatDate(e.date)} | ${e.place}</p>
        ${showCreatorInfo ? `
          <div class="event-creator">
            <img src="${e.creator_image}" alt="${e.creator_name}">
            <span>${e.creator_name}</span>
          </div>` : ``}
      </div>
    `;
  }).join("");
}

function showEventDetail(id) {
  const event = allEvents.find(e => e.id == id);
  if (!event) return;

  document.getElementById("detailTitle").textContent = event.title;
  document.getElementById("detailDatePlace").textContent = `${formatDate(event.date)} | ${event.place}`;
  document.getElementById("detailTime").textContent = event.time ? `${event.time} Uhr` : "";
  document.getElementById("detailImage").src = event.image;
  document.getElementById("detailDescription").textContent = event.description;

  // Nur im Detail-Popup den Ersteller ggf. ausblenden
  const creatorSection = document.getElementById("detailCreator");
  if (event.creator_id != currentUserId) {
    document.getElementById("creatorImage").src = event.creator_image;
    document.getElementById("creatorName").textContent = event.creator_name;
    creatorSection.style.display = "flex";
  } else {
    creatorSection.style.display = "none";
  }

  abmeldenBtn.style.display = (event.creator_id != currentUserId) ? "block" : "none";
  abmeldenBtn.onclick = () => openUnsubscribePopup(id);

  modal.style.display = "flex";
}
closeModalBtn.onclick = () => modal.style.display = "none";

let currentEventToUnsubscribe = null;
function openUnsubscribePopup(eventId) {
  currentEventToUnsubscribe = eventId;
  confirmModal.style.display = "flex";
}

confirmNo.onclick = () => {
  confirmModal.style.display = "none";
  currentEventToUnsubscribe = null;
};

confirmYes.onclick = () => {
  if (!currentEventToUnsubscribe) return;

  fetch("api/calendar_unsubscribe.php", {
    method: "POST",
    body: new URLSearchParams({ event_id: currentEventToUnsubscribe })
  })
    .then(res => res.text())
    .then(() => {
      confirmModal.style.display = "none";
      modal.style.display = "none";
      loadEvents();
    });
};

document.getElementById("prevMonthBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonthBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};