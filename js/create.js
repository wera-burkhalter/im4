document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Verhindert Standard-Submit

    const form = e.target;

    // ✨ Prüfe HTML5-Validierung (zeigt Fehler pro Feld automatisch an)
    if (!form.reportValidity()) {
        return; // Stoppt den Submit, zeigt aber die Fehler im Browser an den Feldern
    }


    // Datum-Validierung: Rückmeldefrist darf nicht nach dem Event-Datum liegen
    const dateValue = new Date(form.date.value);
    const deadlineValue = new Date(form.deadline.value);

    if (deadlineValue > dateValue) {
        alert("Die Rückmeldefrist darf nicht nach dem Event-Datum liegen.");
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

            // Vorschau-Bild ausblenden & zurücksetzen
            const preview = document.getElementById("previewImage");
            if (preview) {
                preview.style.display = "none";
                preview.src = "";
            }

            const fileInput = document.getElementById("imageInput");
            if (fileInput) {
                fileInput.value = "";
            }

        } else {
            alert("Fehler: " + reply.message);
        }

    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern.");
    }
});

// Rückmeldefrist darf nur bis zum Event-Datum wählbar sein
document.getElementById("eventForm").date.addEventListener("change", function () {
    const deadlineInput = document.getElementById("eventForm").deadline;
    deadlineInput.max = this.value;
});

// Bild-Vorschau nach Auswahl
document.getElementById("imageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const preview = document.getElementById("previewImage");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});