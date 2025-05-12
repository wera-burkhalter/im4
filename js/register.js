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
});
