document.querySelector("i.bi-pencil-square").addEventListener("click", (event) => {
    document.querySelector(`#${event.target.id} + input`).classList.toggle("show");
    document.querySelector(`#${event.target.id} + input`).focus();
});

document.querySelector("input[name='name']").addEventListener("keydown", (event) => {
    if (event.target.value.trim().includes(" ")) {
        document.querySelector(`input[type="submit"]`).classList.add("show");
    } else {
        document.querySelector(`input[type="submit"]`).classList.remove("show");
    }
});

document.querySelector("section > button").addEventListener("click", () => {
    window.location.href += '/logout';
});

document.querySelector("a#pass").addEventListener("click", () => {
    window.location.href += '/update'
});

document.querySelectorAll("#upgrade .card .card-footer button").forEach(button => {
    button.addEventListener("click", () => {
        button.children[0].click();
    });
});