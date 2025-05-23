console.log("login.js loaded");

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = document.querySelector("#phone").value.trim();
    const password = document.querySelector("#password").value;

console.log("phone ist:", phone);
console.log("password ist:", password);



    //Formulardaten vorbereiten
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    // Senden
    try {
        const res = await fetch("api/login.php", {
            method: "POST",
            body: formData,
        });

        const reply = await res.text(); // falls du auf JSON umstellst: `await res.json()`
        
        console.log("Antwort vom Server:\n" + reply);
        alert(reply); // einfache Ausgabe im Browser

        if (reply==="X") {

            window.location.href = "homescreen.html"; // Weiterleitung zum Homescreen
        }

    } catch (error) {
        console.error("Fehler beim Senden der Anfrage:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
});
