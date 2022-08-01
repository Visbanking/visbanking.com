document.querySelector("nav.navbar button").addEventListener("click", () => {
	document.querySelector("nav.navbar .navbar-collapse").classList.toggle("show");
});

document.querySelector(".copyright #year").innerHTML = new Date().getFullYear();