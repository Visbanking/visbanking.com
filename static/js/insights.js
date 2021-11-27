Vue.createApp({
    data() {
        return {
            business: true,
            banks: false,
            financial: false,
            market: false,
            politics: false
        }
    },
    methods: {
        showBusiness() {
            this.banks = this.financial = this.market = this.politics = false;
            this.business = true;
        },
        showBanks() {
            this.business = this.financial = this.market = this.politics = false;
            this.banks = true;
        },
        showFinancial() {
            this.banks = this.business = this.market = this.politics = false;
            this.financial = true;
        },
        showMarket() {
            this.banks = this.financial = this.business = this.politics = false;
            this.market = true;
        },
        showPolitics() {
            this.banks = this.financial = this.market = this.business = false;
            this.politics = true;
        }
    }
}).mount("#latest");

document.querySelectorAll("article.post").forEach(post => {
    post.addEventListener("click", () => {
        post.children[post.children.length-1].click();
    });
});

document.querySelectorAll(".post .intro").forEach(intro => {
    intro.innerHTML = intro.innerText;
});

document.querySelectorAll(".post .intro a").forEach(link => {
    link.removeAttribute('href');
});