window.onload = () => {
    if (document.cookie.includes("user")) {
        document.querySelector("#login form input[type='password']").focus();
    }
}

setTimeout(() => {
    document.querySelector("#error").innerHTML = "";
}, 5000);