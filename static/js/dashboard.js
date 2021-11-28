Vue.createApp({
    data() {
        return {
            profile: false,
            admins: false,
            insights: false,
            members: false
        }
    },
    methods: {
        updateProfile() {
            this.admins = this.insights = this.members = false;
            this.profile = !this.profile;
        },
        updateAdmins() {
            this.profile = this.insights = this.members = false;
            this.admins = !this.admins;
        },
        updateInsights() {
            this.admins = this.profile = this.members = false;
            this.insights = !this.insights;
        },
        updateMembers() {
            this.admins = this.insights = this.profile = false;
            this.members = !this.members;
        }
    }
}).mount("#panel");

document.querySelectorAll("#panel div:last-of-type aside button:not(aside.articles button:first-of-type)").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");
        button.nextElementSibling.classList.toggle("active");
    });
});

document.querySelector("aside.articles button:first-of-type").addEventListener("click", () => {
    document.querySelector("aside.articles button:first-of-type a").click();
});

setTimeout(() => {
    document.querySelector("p.message").innerHTML = '';
}, 10000);