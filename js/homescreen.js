console.log("homescreen.js loaded");

//Infos aus dem PHP holen

fetch("api/homescreen.php")
    .then ((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
    console.error("Fehler beim Senden:", error);
    });
