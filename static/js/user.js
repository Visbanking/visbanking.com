document.querySelector("i.bi-pencil-square").addEventListener("click", (event) => {
    document.querySelectorAll(`#${event.target.id} + input`).forEach(input => console.log(input));
    document.querySelectorAll(`#${event.target.id} + input`).forEach(input => input.classList.toggle("show"));
});