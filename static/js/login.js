window.onload = () => {
    if (document.cookie.includes("username")) {
        document.querySelector("#login form input[type='password']").focus();
    }
}

setTimeout(() => {
    document.querySelector("#error").innerHTML = "";
}, 5000);