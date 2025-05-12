console.log("hello from register js!");

document
.getElementById("registerForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    //Felder abrufen
    const phone = document.querySelector("#phone").value;
    console.log(phone);
    const firstName = document.querySelector("#firstName").value;
    console.log(firstName);
    const surname = document.querySelector("#surname").value;
    console.log(surname);
    const password = document.querySelector("#password").value;
    console.log(password);
    const fileInput = document.querySelector("#profilePicture");
    console.log(fileInput);
    const file = fileInput.files[0];
    console.log(file);

    //Validierung
    if (!phone || !firstName || !surname || !password || !file) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    if (password.length < 8) {
        alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
        return;
    }

    //Formulardaten vorbereiten
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("firstName", firstName);
    formData.append("surname", surname);
    formData.append("password", password);
    formData.append("profilePicture", file);

    // Senden
    try {
        const res = await fetch("api/register.php", {
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

