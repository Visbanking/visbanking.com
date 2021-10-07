window.onload = () => {
    if (document.cookie.includes("username")) {
        document.querySelector("#login form input[type='password']").focus();
    }
}