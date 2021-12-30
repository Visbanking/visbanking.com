if (window.location.search.includes("session_id")) {
    setTimeout(() => { window.location.replace("/login"); }, 5000);
} else {
    setTimeout(() => { window.location.replace("/"); }, 10000);
}