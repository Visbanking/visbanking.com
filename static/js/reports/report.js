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

	if (window.location.href.includes("reports/bank")) {
		if (window.location.pathname.split("/").slice(-1)[0] === "general") {
			const firstLevelLinks = document.querySelectorAll("#report nav > ul > li > a");
			
			firstLevelLinks.forEach((link, index) => {
				if (index === 0) {
					link.target = "_blank";
					link.href = `/buy?tier=professional`;
				} else if (index === 1) link.href = `/`;
			});
		} else {
			const firstLevelLinks = document.querySelectorAll("#report nav > ul > li > a");
			const secondLevelLinks = document.querySelectorAll("#report nav ul li ul li a");
		
			firstLevelLinks.forEach((link, index) => {
				if (secondLevelLinks.length) {
					if (index === 0) link.href = `${window.location.pathname}?type=html&page=index`;
					else if (index === firstLevelLinks.length-1) link.href = "/";
					else link.href = `${window.location.pathname}?type=html&page=${link.innerText.toLowerCase().replaceAll(" ", "-")}`
				}
			});
		
			secondLevelLinks.forEach((link) => {
				const parentHref = link.parentElement.parentElement.previousElementSibling.href;
				link.href = `${parentHref}${link.hash}`;
			});
	
			document.querySelector(".body-inner .book-header h1 a").href = "#report";	
		
			document.querySelectorAll(".section.level2.unnumbered div.highchart.html-widget svg").forEach(svg => {
				svg.width = svg.parentElement.innerWidth;
			});
		}
	}
}