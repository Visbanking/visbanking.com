if (window.location.search.includes("session_id") || window.location.pathname.includes("recovery/reset")) {
    setTimeout(() => { window.location.replace("/login"); }, 5000);
} else if (window.location.pathname.includes("signup/success")) {
    setTimeout(() => { window.location.replace("/me"); }, 10000);
} else {
    setTimeout(() => { window.location.replace("/"); }, 5000);
}