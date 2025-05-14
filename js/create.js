document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch ("api/events.php", {
            method: "POST",
            body: formData,
        });
    
        const reply = await res.json();

        if (reply.status === "success") {
            document.getElementById("successMessage").style.display = "block";
            form.reset();
        } else {
            alert("Fehler:" + reply.message)       
        }
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern.");
    }

});