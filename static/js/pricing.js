const maxCardHeight = document.querySelector(".plan#professional").offsetHeight+20;

document.querySelectorAll("aside.plan").forEach(card => {
	card.style.height = `${maxCardHeight}px`;
});