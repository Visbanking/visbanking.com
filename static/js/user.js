const app = Vue.createApp({
    data() {
        return {
            profile: true,
            products: false
        }
    },
    methods: {
        showSection(sectionClass) {
            this.profile = this.products = false;
            if (sectionClass === 'profile') {
                this.profile = true;
                setTimeout(renderGoogleSignInClient, 0);
            }
            else if (sectionClass === 'products') this.products = true;
        },
        edit(inputName) {
            if (inputName === 'picture') {
                document.querySelector(`input[type='file']`).click();
            } else {
                document.querySelector(`p.data.${inputName}`).classList.toggle("show");
                document.querySelector(`input#${inputName}`).classList.toggle("show");
                document.querySelector(`input#${inputName}`).focus();
            }
        },
        validate(inputName) {
            if (inputName === 'picture') {
                const [ file ] = document.querySelector("input#image").files;
                if (file) {
                    document.querySelector("#preview").src = URL.createObjectURL(file);
                    document.querySelector("#preview").classList.add("show");
                    document.querySelector("#profile").classList.remove("show");
                }
                if (event.target.value.includes("C:")) {
                    document.querySelector(`input[type="submit"]`).classList.add("show");
                    document.querySelector(`input[type="reset"]`).classList.add("show");
                } else {
                    document.querySelector(`input[type="submit"]`).classList.remove("show");
                    document.querySelector(`input[type="reset"]`).classList.remove("show");
                }
            } else {
                const inputValue = document.querySelector(`input#${inputName}`).value;
                if (inputValue.split(" ").length === 2) {
                    document.querySelector(`input[type="submit"]`).classList.add("show");
                    document.querySelector(`input[type="reset"]`).classList.add("show");
                } else {
                    document.querySelector(`input[type="submit"]`).classList.remove("show");
                    document.querySelector(`input[type="reset"]`).classList.remove("show");
                }
            }
        },
        reset() {
            document.querySelectorAll("input").forEach(input => input.classList.remove("show"));
            document.querySelector("p.data.name").classList.add("show");
            document.querySelector("#preview").classList.remove("show");
            document.querySelector("#profile").classList.add("show");
            document.querySelector("input[type=submit]").classList.remove("show");
            document.querySelector("input[type=reset]").classList.remove("show");
        },
        cancel() {
            const confirmation = confirm("Are you sure you want to cancel your subscription?");
            if (confirmation) window.location.href += "/cancel";
        }, 
        deleteAccount() {
            const confirmation = confirm("Are you sure you want to delete your account?");
            if (confirmation) window.location.href += "/delete";
        }
    }
}).mount("main section");

setTimeout(() => {
    if (document.querySelector("p#message")) document.querySelector("p#message").innerHTML = "";
    else if (document.querySelector("p#error")) document.querySelector("p#error").innerHTML = "";
}, 10000);