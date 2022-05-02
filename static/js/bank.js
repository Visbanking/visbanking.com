document.querySelector("#upgrade") ? (window.location.hash = "#upgrade") : "";

if (document.querySelector("#report")) {
	document.querySelector("div#report").innerHTML = document.querySelector("div#report").innerText;

	const firstLevelLinks = document.querySelectorAll("#report nav > ul > li > a");
	const secondLevelLinks = document.querySelectorAll("#report nav ul li ul li a");

	firstLevelLinks.forEach((link, index) => {
		if (index === 0) link.href = `${window.location.pathname.split("/").slice(0, 5).join("/")}/bank`;
		if (index === 1) link.href = `${window.location.pathname.split("/").slice(0, 5).join("/")}/enforcement`;
		if (index === 2) link.href = `${window.location.pathname.split("/").slice(0, 5).join("/")}/balance`;
		if (index === 3) link.href = `${window.location.pathname.split("/").slice(0, 5).join("/")}/income`;
		if (index === 4) link.href = `${window.location.pathname.split("/").slice(0, 5).join("/")}/loans`;
		if (index === 5) link.href = "/";
	});

	secondLevelLinks.forEach((link) => {
		const parentHref = link.parentElement.parentElement.previousElementSibling.href;
		link.href = `${parentHref}${link.hash}`;
	});

    document.querySelector("p.loader").classList.remove("active");
    document.querySelector("#report").classList.add("active");
}