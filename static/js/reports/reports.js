document.querySelectorAll(".reportTypes a").forEach(button => {
	button.addEventListener("click", () => {
		document.querySelectorAll(`aside.reportType:not([id='${button.dataset.reportType}'])`).forEach(aside => {
			aside.classList.remove("active");
		});
		document.querySelectorAll(`.reportTypes a:not([data-report-type='${button.dataset.reportType}'])`).forEach(aside => {
			aside.classList.remove("active");
		});
		document.querySelector(`.reportTypes a[data-report-type='${button.dataset.reportType}']`).classList.add("active");
		document.querySelector(`aside.reportType[id='${button.dataset.reportType}']`).classList.add("active");	
	});
});