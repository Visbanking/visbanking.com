const maxCardHeight = document.querySelector(".plan#enterprise").offsetHeight + 10;

document.querySelectorAll("aside.plan").forEach(card => {
    card.style.height = `${maxCardHeight}px`
});