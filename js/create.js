document.addEventListener("DOMContentLoaded", () => {
  // --- Freundesliste Setup ---
  const selectedFriends = new Map();
  const selectedFriendsContainer = document.getElementById("selectedFriends");
  const searchInput = document.getElementById("friendSearch");
  const resultsBox = document.getElementById("friendResults");
  const friendErrorBox = document.getElementById("friendError");

  let allFriends = [];

  async function loadFriends() {
    try {
      const res = await fetch("api/showFriends.php");
      allFriends = await res.json();
    } catch (err) {
      console.error("Fehler beim Laden der Freundesliste:", err);
    }
  }

  function updateFriendResults(query) {
    resultsBox.innerHTML = "";
    if (!query.trim()) {
      resultsBox.style.display = "none";
      return;
    }

    const filtered = allFriends.filter(friend => {
      const first = friend.firstName.toLowerCase();
      const last = friend.surname.toLowerCase();
      const q = query.toLowerCase();
      return (first.startsWith(q) || last.startsWith(q)) && !selectedFriends.has(friend.id);
    });

    if (filtered.length === 0) {
      resultsBox.style.display = "none";
      return;
    }

    resultsBox.style.display = "block";

    filtered.forEach(friend => {
      const div = document.createElement("div");
      div.textContent = `${friend.firstName} ${friend.surname}`;
      div.addEventListener("click", () => {
        addSelectedFriend(friend);
        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";
        searchInput.value = "";
      });
      resultsBox.appendChild(div);
    });
  }

  function addSelectedFriend(friend) {
    selectedFriends.set(friend.id, friend);

    const wrapper = document.createElement("div");
    wrapper.className = "selected-friend";
    wrapper.setAttribute("data-id", friend.id);

    wrapper.innerHTML = `
      <img src="${friend.profilbild}" alt="">
      <span>${friend.firstName} ${friend.surname}</span>
      <span class="remove">&times;</span>
      <input type="hidden" name="invitedFriends[]" value="${friend.id}">
    `;

    wrapper.querySelector(".remove").addEventListener("click", () => {
      selectedFriends.delete(friend.id);
      wrapper.remove();
    });

    selectedFriendsContainer.appendChild(wrapper);

    if (friendErrorBox) {
      friendErrorBox.style.display = "none";
    }
  }

  searchInput.addEventListener("input", () => {
    updateFriendResults(searchInput.value);
  });

  loadFriends();

  // --- Formular Validierung & Einreichung ---
  function validateField(id, message) {
    const input = document.getElementById(id);
    const errorBox = document.getElementById(id + "Error");
    if (!input.value.trim()) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    } else {
      errorBox.style.display = "none";
      return true;
    }
  }

  const form = document.getElementById("eventForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Pflichtfelder prüfen
    if (
      !validateField("title", "Bitte gib einen Titel ein.") ||
      !validateField("description", "Bitte gib eine Beschreibung ein.") ||
      !validateField("place", "Bitte gib einen Ort ein.") ||
      !validateField("date", "Bitte wähle ein Datum.") ||
      !validateField("deadline", "Bitte gib eine Rückmeldefrist an.")
    ) {
      return;
    }

    if (!form.reportValidity()) return;

    if (selectedFriends.size === 0) {
      friendErrorBox.textContent = "Bitte lade mindestens eine Person ein.";
      friendErrorBox.style.display = "block";
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    } else {
      friendErrorBox.style.display = "none";
    }

    const dateValue = new Date(form.date.value);
    const deadlineValue = new Date(form.deadline.value);
    if (deadlineValue > dateValue) {
      alert("Die Rückmeldefrist darf nicht nach dem Event-Datum liegen.");
      return;
    }

    const formData = new FormData(form);

    try {
      const res = await fetch("api/events.php", {
        method: "POST",
        body: formData,
      });

      const reply = await res.json();

      if (reply.status === "success") {
        const popup = document.getElementById("successPopup");
        popup.classList.add("show");
        popup.style.display = "block";

        form.reset();
        const preview = document.getElementById("previewImage");
        if (preview) {
          preview.style.display = "none";
          preview.src = "";
        }

        const fileInput = document.getElementById("imageInput");
        if (fileInput) fileInput.value = "";

        selectedFriends.clear();
        selectedFriendsContainer.innerHTML = "";
        searchInput.value = "";
        resultsBox.innerHTML = "";
        resultsBox.style.display = "none";

        setTimeout(() => {
          window.location.href = "events.html";
        }, 2000);
      } else {
        alert("Fehler: " + reply.message);
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    }
  });

  // --- Rückmeldefrist an Eventdatum koppeln ---
  form.date.addEventListener("change", function () {
    form.deadline.max = this.value;
  });

  // --- Min-Datum auf heute setzen ---
  const today = new Date().toISOString().split("T")[0];
  form.date.min = today;
  form.deadline.min = today;

  // --- Bildvorschau ---
  document.getElementById("imageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const preview = document.getElementById("previewImage");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
});