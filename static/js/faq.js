document.querySelector(".faq").classList.add("active");

document.querySelectorAll(".question").forEach(question => {
	question.addEventListener("click", () => {
		document.querySelector(".faq.active").classList.remove("active");
		question.parentElement.classList.toggle("active");
	});
});