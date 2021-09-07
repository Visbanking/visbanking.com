document.querySelector("#login button").addEventListener("click", () => {
    let validInputValues = true;
    document.querySelectorAll("#login form input:not([type='submit'])").forEach((input) => {
        console.log(input.type);
        if (input.value.trim() === "") {
            validInputValues = false;
            return alert(`Please enter your ${input.id}`);
        }
    });
    if (validInputValues) document.querySelector("#login form input[type=submit]").click();
});

document.querySelector("#login form").addEventListener("keydown", (event) => {
    if (event.key === "Enter")
        document.querySelector("#login button").click();
});