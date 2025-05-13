console.log("login.js loaded");

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginInfo = document.querySelector("#userPhone").value.trim();
    const password = document.querySelector("#password").value;

console.log("loginInfo ist:", loginInfo);
console.log("password ist:", password);

});