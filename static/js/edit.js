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