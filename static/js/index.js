setInterval(() => {
	const images = [ ...document.querySelectorAll("#intro img") ];
	const currentImageIndex = images.indexOf(document.querySelector("#intro img.active"));
	const nextImageIndex = (currentImageIndex===images.length-1) ? 0 : currentImageIndex+1;
	images[currentImageIndex].classList.remove("active");
	images[nextImageIndex].classList.add("active");
}, 5000);