document.querySelectorAll("#services .service").forEach(service => {
	service.addEventListener("click", () => {
		window.location.href = `/services/${service.dataset.path}`;
	});
});