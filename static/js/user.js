localStorage.setItem("username", document.querySelector("#username").innerText.slice(1, this.length-1));

document.querySelector("#username i.bi-pencil-square").addEventListener("click", () => {
    document.querySelector("p#username + form:first-of-type").classList.toggle("show");
});