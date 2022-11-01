document.querySelectorAll("input#headerImage").forEach(input => {
	input.addEventListener("change", (event) => {
		const [file] = event.target.files;
		console.log("here");
		if (file) {
			input.previousElementSibling.src = URL.createObjectURL(file);
		} else {
			input.previousElementSibling.src = "";
		}
	});
});

document.querySelector("input[type='reset']").addEventListener("click", () => {
	window.location.pathname = window.location.pathname.split("/").slice(0, 4).join("/");
});