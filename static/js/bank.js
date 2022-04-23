document.querySelector("#upgrade") ? window.location.hash = "#upgrade" : "";

document.querySelector("iframe")?.addEventListener("load", (event) => {
    event.target.classList.add("active");
    document.querySelector("p.loader").classList.remove("active");
});