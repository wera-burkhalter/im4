console.log("register.js loaded");

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.querySelector("#phone").value.trim();
  const firstName = document.querySelector("#firstName").value.trim();
  const surname = document.querySelector("#surname").value.trim();
  const password = document.querySelector("#password").value;
  const fileInput = document.querySelector("#profilePicture");
  const file = fileInput.files[0];

  if (!phone || !firstName || !surname || !password || !file) {
    showError("Bitte fülle alle Felder aus.");
    return;
  }

  if (password.length < 8) {
    showError("Das Passwort muss mindestens 8 Zeichen lang sein.");
    return;
  }

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("firstName", firstName);
  formData.append("surname", surname);
  formData.append("password", password);
  formData.append("profilePicture", file);

  try {
    const res = await fetch("api/register.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.status === "success") {
      window.location.href = "login.html"; // Weiterleiten zur Login-Seite
    } else {
      showError(data.message);
    }
  } catch (err) {
    console.error("Fehler beim Registrieren:", err);
    showError("Ein technischer Fehler ist aufgetreten.");
  }
});

function showError(msg) {
  const el = document.getElementById("errorMessage");
  el.textContent = msg;
  el.style.display = "block";
}


