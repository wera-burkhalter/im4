document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Verhindert Standard-Submit

    const form = e.target;

    // ✨ Prüfe HTML5-Validierung (zeigt Fehler pro Feld automatisch an)
    if (!form.reportValidity()) {
        return; // Stoppt den Submit, zeigt aber die Fehler im Browser an den Feldern
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
