document.querySelector("#upgrade") ? (window.location.hash = "#upgrade") : "";

if (document.querySelector("#report")) {
	const showReport = () => {
		document.querySelector("p.loader").classList.remove("active");
		document.querySelector("#report").classList.add("active");
		window.location.hash ||= "#report";
	};

	if (document.querySelector("div#report")) {
		document.querySelector("div#report").innerHTML = document.querySelector("div#report").innerText;
		showReport();
	}

	document.querySelector("iframe#report")?.addEventListener("load", showReport);
}