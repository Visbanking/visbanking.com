const maxCardHeight = document.querySelector(".plan#enterprise").offsetHeight;

document.querySelectorAll("aside.plan").forEach(card => {
    card.style.height = `${maxCardHeight}px`
});

document.querySelectorAll(".card-footer button a").forEach(link => {
    link.addEventListener("click", () => {
        window.location.href = link.getAttribute("href");
    });
});

document.querySelectorAll(".card .card-footer button").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        button.children[0].click();
    });
});