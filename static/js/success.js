if (window.location.search.includes("session_id") || window.location.pathname.includes("recovery/reset")) {
    setTimeout(() => { window.location.replace("/login"); }, 5000);
} else {
    setTimeout(() => { window.location.replace("/"); }, 5000);
}