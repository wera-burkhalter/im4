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

    // =============================
// 1. SESSIONDATEN LADEN (User-Profilbild etc.)
// =============================
fetch("api/protected.php")
  .then((res) => {
    if (!res.ok) throw new Error("Antwortstatus nicht OK");
    return res.json();
  })
  .then((data) => {
  if (data.status === "error") {
    window.location.href = "login.html";
  } else {
    if (data.profilbild && profilbild) {
      profilbild.src = data.profilbild;
    }
    ladeFreunde(); // <- WICHTIG!
  }
})
  .catch((err) => {
    console.error("Fehler beim Laden der Sessiondaten:", err);
    alert("Fehler beim Laden. Bitte neu einloggen.");
  });
