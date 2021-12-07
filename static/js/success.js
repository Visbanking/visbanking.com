if (window.location.search.includes("session_id")) {
    setTimeout(() => { window.location.replace(`/signup?tier=${document.querySelector("#tier").innerText.trim().toLowerCase()}`); }, 5000);
} else {
    setTimeout(() => { window.location.replace("/"); }, 10000);
}