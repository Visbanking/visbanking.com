document.querySelectorAll("article.post").forEach(post => {
    post.addEventListener("click", () => {
        document.querySelector(`.post#${post.id} > a`).click();
    });
});

document.querySelectorAll(".post .intro").forEach(intro => {
    intro.innerHTML = intro.innerText;
});

document.querySelectorAll(".post .intro a").forEach(link => {
    link.removeAttribute('href');
});