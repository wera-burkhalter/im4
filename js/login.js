console.log("login.js loaded");

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.querySelector("#phone").value.trim();
  const password = document.querySelector("#password").value;

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  try {
    const res = await fetch("api/login.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.status === "success") {
      window.location.href = "homescreen.html";
    } else {
      showError(data.message); // z. B. "Passwort nicht korrekt"
    }
  } catch (err) {
    console.error("Fehler beim Login:", err);
    showError("Ein technischer Fehler ist aufgetreten.");
  }
});

// Zeige Fehlernachricht im DOM
function showError(msg) {
  const el = document.getElementById("errorMessage");
  el.textContent = msg;
  el.style.display = "block";
}

