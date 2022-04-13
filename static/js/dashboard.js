Vue.createApp({
    data() {
        return {
            profile: false,
            admins: false,
            insights: false,
            members: false,
            questions: false
        }
    },
    methods: {
        updateProfile() {
            this.admins = this.insights = this.members = this.questions = false;
            this.profile = !this.profile;
        },
        updateAdmins() {
            this.profile = this.insights = this.members = this.questions = false;
            this.admins = !this.admins;
        },
        updateInsights() {
            this.admins = this.profile = this.members = this.questions = false;
            this.insights = !this.insights;
        },
        updateMembers() {
            this.admins = this.insights = this.profile = this.questions = false;
            this.members = !this.members;
        },
        updateQuestions() {
            this.admins = this.insights = this.profile = this.members = false;
            this.questions = !this.questions;
        }
    }
}).mount("#panel");

document.querySelectorAll("#panel div:last-of-type aside button:not(aside.articles button:first-of-type)").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");
        button.nextElementSibling.classList.toggle("active");
    });
});

document.querySelectorAll("aside.articles button:not(:last-of-type)").forEach(button => {
    button.addEventListener("click", () => {
        button.children[0].click();
    });
});

setTimeout(() => {
    document.querySelector("p.message").innerHTML = '';
}, 10000);