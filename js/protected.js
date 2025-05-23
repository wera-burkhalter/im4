console.log("protected.js loaded");

//Infos aus dem PHP holen

fetch("api/protected.php")
    .then ((response) => response.json())
    .then((data) => {
        console.log(data);

        if (data.status === "error") {
            window.location.href = "login.html"; // redirect to Login-Seite
        } else{
            //write welcome message to html
            document.getElementById("welcomeMessage") .innerHTML = "Willkommen " + data.firstName;


        }
    })
    .catch((error) => {
    console.error("Fehler beim Senden:", error);
    });
