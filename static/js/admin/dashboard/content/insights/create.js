document.querySelector("span.md").addEventListener("click", () => {
	document.querySelector("form#md").classList.add("active");
	document.querySelector("section#text").classList.remove("active");
	document.querySelector("span.md").classList.add("active");
	document.querySelector("span.txt").classList.remove("active");
});

document.querySelector("span.txt").addEventListener("click", () => {
	document.querySelector("form#md").classList.remove("active");
	document.querySelector("section#text").classList.add("active");
	document.querySelector("span.md").classList.remove("active");
	document.querySelector("span.txt").classList.add("active");
});

document.querySelectorAll("input#headerImage").forEach(input => {
	input.addEventListener("change", (event) => {
		const [file] = event.target.files;
		if (file) {
			input.previousElementSibling.src = URL.createObjectURL(file);
		} else {
			input.previousElementSibling.src = "";
		}
	});
});

document.querySelector("textarea#body").addEventListener("input", (event) => {
	if (event.target.value !== "") {
		document.querySelector("input#bodyFile").disabled = true;
		document.querySelector("input#bodyFile").title = "Clear the 'BODY' section to upload file";
	} else {
		document.querySelector("input#bodyFile").disabled = false;
		document.querySelector("input#bodyFile").title = "Choose file to upload";
		document.querySelector("input#bodyFile").value = "";
	}
});

document.querySelector("input#bodyFile").addEventListener("change", async (event) => {
	const text = await event.target.files[0].text();
	document.querySelector("textarea").value = text;
	document.querySelector("input#bodyFile").disabled = true;
	document.querySelector("input#bodyFile").title = "Clear the 'BODY' section to upload file";
	document.querySelector("span.md").click();
});

document.querySelector(".codex-editor__redactor").style.paddingBottom = "0";

document.querySelector("input[type='reset']").addEventListener("click", () => {
	window.location.pathname = window.location.pathname.split("/").slice(0, 4).join("/");
});