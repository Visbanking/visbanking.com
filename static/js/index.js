document.querySelectorAll("#featured .post").forEach(post => {
	post.addEventListener("click", () => {
		post.children[post.children.length-1].click();
	});
});

document.querySelectorAll("#latest .post").forEach(post => {
	post.addEventListener("click", () => {
		post.children[post.children.length-1].click();
	});
});

setInterval(() => {
	const images = [ ...document.querySelectorAll("#dashboards img") ];
	const indicators = [ ...document.querySelectorAll("#dashboards .indicator i.bi-dot") ];
	const currentImageIndex = images.indexOf(document.querySelector("#dashboards img.active"));
	const nextImageIndex = (currentImageIndex===images.length-1) ? 0 : currentImageIndex+1;
	images[currentImageIndex].classList.remove("active");
	indicators[currentImageIndex].classList.remove("active");
	images[nextImageIndex].classList.add("active");
	indicators[nextImageIndex].classList.add("active");
}, 10000);