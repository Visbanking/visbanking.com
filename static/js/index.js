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