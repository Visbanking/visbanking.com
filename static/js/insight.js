document.querySelectorAll("article main a").forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer noopener nofollow');
});