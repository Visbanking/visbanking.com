if (!document.querySelector("form")) {
    setTimeout(() => {
        window.location.replace("/");
    }, 5000);
}

document.querySelector("input[type=submit]").addEventListener("click", (event) => {
    const pass = document.querySelector("#pass").value, confirm = document.querySelector("#confirm").value;
    if (pass !== confirm) {
        event.preventDefault();
        document.querySelector("#error").innerHTML = 'Passwords don\'t match';
    }
});