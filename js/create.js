document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Verhindert Standard-Submit

    const form = e.target;

    // Prüfe HTML5-Validierung (zeigt Fehler pro Feld automatisch an)
    if (!form.reportValidity()) {
        return; // Stoppt den Submit, zeigt aber die Fehler im Browser an den Feldern
    }

    // Freunde-Auswahl prüfen (mind. 1 Person)
    const friendErrorBox = document.getElementById("friendError");

    if (selectedFriends.size === 0) {
        friendErrorBox.textContent = "Bitte lade mindestens eine Person ein.";
        friendErrorBox.style.display = "block";
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    } else {
    friendErrorBox.style.display = "none";
}

    // Datum-Validierung: Rückmeldefrist darf nicht nach dem Event-Datum liegen
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

            // Vorschau-Bild ausblenden & zurücksetzen
            const preview = document.getElementById("previewImage");
            if (preview) {
                preview.style.display = "none";
                preview.src = "";
            }

            const fileInput = document.getElementById("imageInput");
            if (fileInput) {
                fileInput.value = "";
            }

            // Freundeliste zurücksetzen
            selectedFriends.clear();
            selectedFriendsContainer.innerHTML = "";
            searchInput.value = "";
            resultsBox.innerHTML = "";
            resultsBox.style.display = "none";

            // Weiterleitung nach 2 Sekunden
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

// Rückmeldefrist darf nur bis zum Event-Datum wählbar sein
document.getElementById("eventForm").date.addEventListener("change", function () {
    const deadlineInput = document.getElementById("eventForm").deadline;
    deadlineInput.max = this.value;
});

// Bild-Vorschau nach Auswahl
document.getElementById("imageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const preview = document.getElementById("previewImage");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

// Freundesliste laden und in das Select-Feld einfügen
const selectedFriends = new Map();
const selectedFriendsContainer = document.getElementById("selectedFriends");
const searchInput = document.getElementById("friendSearch");
const resultsBox = document.getElementById("friendResults");

let allFriends = [];

async function loadFriends() {
    try {
        const res = await fetch("api/showFriends.php");
        const friends = await res.json();
        allFriends = friends;
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
}

searchInput.addEventListener("input", () => {
    updateFriendResults(searchInput.value);
});

loadFriends();

// Event-Datum: Mindestwert = heute
const dateInput = document.querySelector('input[name="date"]');
const today = new Date().toISOString().split("T")[0];
dateInput.min = today;
const deadlineInput = document.querySelector('input[name="deadline"]');
deadlineInput.min = today;