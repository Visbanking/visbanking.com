document.querySelectorAll("article.post").forEach(post => {
    post.addEventListener("click", () => {
        post.children[post.children.length-1].click();
    });
});

document.querySelectorAll(".post .intro").forEach(intro => {
    intro.innerHTML = intro.innerText;
});

document.querySelectorAll(".post .intro a").forEach(link => {
    link.removeAttribute('href');
});