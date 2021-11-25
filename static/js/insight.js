document.querySelector("article main").innerHTML = document.querySelector("article main").innerText;

document.querySelectorAll("article main a").forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener nofollow');
});