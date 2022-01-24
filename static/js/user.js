setTimeout(() => {
    if (document.querySelector("p#message")) document.querySelector("p#message").innerHTML = "";
    else if (document.querySelector("p#error")) document.querySelector("p#error").innerHTML = "";
}, 10000);

document.querySelector("#profile").addEventListener("click", (event) => {
    document.querySelector(`#${event.target.id} + input[type='file']`).click();
});

document.querySelector("input[type='file']").addEventListener("input", (event) => {
    const [file] = event.target.files;
    if (file) {
        document.querySelector("#profile").src = URL.createObjectURL(file);
        document.querySelector("#profile").classList.add("unsaved");
    }
    if (event.target.value.includes("C:")) document.querySelector(`input[type="submit"]`).classList.add("show");
    else document.querySelector(`input[type="submit"]`).classList.remove("show");
});

document.querySelector("i.bi-pencil-square").addEventListener("click", (event) => {
    document.querySelector(`#${event.target.id} + input`).classList.toggle("show");
    document.querySelector(`#${event.target.id} + input`).focus();
});

document.querySelector("input[name='name']").addEventListener("keydown", (event) => {
    if (event.target.value.split(" ").length === 2) {
        document.querySelector(`input[type="submit"]`).classList.add("show");
    } else {
        document.querySelector(`input[type="submit"]`).classList.remove("show");
    }
});

if (document.querySelector(".danger > #cancel")) {
    document.querySelector(".danger > #cancel").addEventListener("click", () => {
        const confirmation = confirm("Are you sure you want to cancel your subscription?");
        if (confirmation) window.location.href += "/cancel";
    });
}

document.querySelector(".danger > #delete").addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) window.location.href += "/delete";
});