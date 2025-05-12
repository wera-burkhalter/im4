console.log("hello from register js!");

document
.getElementById("registerForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = document.querySelector("#email").value;
    console.log(email);

    let username = document.querySelector("#username").value;
    console.log(username);

    let password = document.querySelector ("#password").value;
    console.log(password);

    if(!username || !email || !password) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }
    if (password.length < 8) {
        alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
        return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    let fileInput = document.querySelector("#profilePicture");
    let file = fileInput.files[0];
    formData.append("profilePicture", file);

    try {
        const res = await fetch("api/register.php", {
            method: "POST",
            body: formData,
        });
        const data = await res.text();
        console.log("Antwort vom Server:\n" + data);
        alter (reply)
    } catch (error) {
        console.error("Fehler beim Senden der Anfrage:", error);
    }

});

