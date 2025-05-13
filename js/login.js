console.log("login.js loaded");

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginInfo = document.querySelector("#userPhone").value.trim();
    const password = document.querySelector("#password").value;

console.log("loginInfo ist:", loginInfo);
console.log("password ist:", password);



    //Formulardaten vorbereiten
    const formData = new FormData();
    formData.append("loginInfo", phone);
    formData.append("password", password);

    // Senden
    try {
        const res = await fetch("api/login.php", {
            method: "POST",
            body: formData,
        });

        const data = await res.text(); // falls du auf JSON umstellst: `await res.json()`
        
        console.log("Antwort vom Server:\n" + data);
        alert(data); // einfache Ausgabe im Browser
    } catch (error) {
        console.error("Fehler beim Senden der Anfrage:", error);
        alert("Ein Fehler ist aufgetreten.");
    }
});
