// Benutzerdefinierte Validierung
const validateForm = (form) => {
  let isValid = true;

  // Alle vorherigen Validierungen zurücksetzen
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.setCustomValidity("");
  });

  // Titel prüfen
  const title = form.querySelector("[name='title']");
  if (!title.value.trim()) {
    title.setCustomValidity("Bitte gib einen Titel ein.");
    isValid = false;
  }

  // Beschreibung prüfen
  const description = form.querySelector("[name='description']");
  if (!description.value.trim()) {
    description.setCustomValidity("Bitte gib eine Beschreibung ein.");
    isValid = false;
  }

  // Datum prüfen
  const date = form.querySelector("[name='date']");
  if (!date.value) {
    date.setCustomValidity("Bitte wähle ein Datum aus.");
    isValid = false;
  }

  // Ort prüfen
  const place = form.querySelector("[name='place']");
  if (!place.value.trim()) {
    place.setCustomValidity("Bitte gib den Ort ein.");
    isValid = false;
  }

  // Rückmeldefrist prüfen
  const deadline = form.querySelector("[name='deadline']");
  if (!deadline.value) {
    deadline.setCustomValidity("Bitte gib die Rückmeldefrist an.");
    isValid = false;
  }

  return isValid;
};

// Submit-Handler
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  // Benutzerdefinierte Feldprüfung
  if (!validateForm(form)) {
    form.reportValidity(); // Zeigt eigene Fehlermeldung beim jeweiligen Feld
    return;
  }

  const formData = new FormData(form);

  try {
    const res = await fetch("api/events.php", {
      method: "POST",
      body: formData,
    });

    const reply = await res.json();

    if (reply.status === "success") {
      document.getElementById("successMessage").style.display = "block";
      form.reset();
    } else {
      alert("Fehler: " + reply.message);
    }

  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    alert("Fehler beim Speichern.");
  }
});
