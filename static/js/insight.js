document.querySelector("article main").innerHTML = document.querySelector("article main").innerText;

document.querySelectorAll("article main a").forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener nofollow');
});

document.querySelector("#share #linkedin").setAttribute('href', `https://linkedin.com/cws/share/?url=${window.location.href}`);
document.querySelector("#share #facebook").setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`);
document.querySelector("#share #twitter").setAttribute('href', `https://twitter.com/intent/tweet?text=${document.title}&url=${window.location.href}`);

document.querySelectorAll("#related .intro").forEach(intro => {
    intro.innerHTML = intro.innerText;
    intro.innerText = intro.innerText.split("\n\n")[0];
});

document.querySelectorAll(".post").forEach(post => {
    post.addEventListener("click", () => {
        post.children[post.children.length-1].click();
    });
});