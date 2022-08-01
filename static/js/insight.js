document.querySelector("article main").innerHTML = document.querySelector("article main").innerText;

if (!document.querySelector("meta[name='description']").content) {
	const descriptionText = document.querySelector(".body main p").innerText;
	document.querySelector("meta[property='og:description']").content = document.querySelector("meta[name='description']").content = descriptionText;
}

document.querySelectorAll("article main a").forEach(link => {
	link.setAttribute("target", "_blank");
	link.setAttribute("rel", "noreferrer noopener nofollow");
});

document.querySelector("#share #linkedin").setAttribute("href", `https://linkedin.com/cws/share/?url=${window.location.href}`);
document.querySelector("#share #facebook").setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`);
document.querySelector("#share #twitter").setAttribute("href", `https://twitter.com/intent/tweet?text=${document.title}&url=${window.location.href}`);

document.querySelectorAll("#related .intro").forEach(intro => {
	intro.innerHTML = intro.innerText;
	intro.innerText = intro.innerText.split("\n\n")[0];
});

document.querySelectorAll(".post").forEach(post => {
	post.addEventListener("click", () => {
		post.children[post.children.length-1].click();
	});
});

window.onscroll = () => {
	const yAxis = window.scrollY;
	const articleTop = document.querySelector("article").offsetTop;
	const articleHeight = document.querySelector("article").offsetHeight;
	const articleProgress = articleTop - yAxis;
	if (yAxis >= articleTop) document.querySelector("progress").value = Math.abs(articleProgress/articleHeight);
	else document.querySelector("progress").value = 0;
};