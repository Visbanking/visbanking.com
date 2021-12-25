document.querySelectorAll("article.post").forEach(post => {
    post.addEventListener("click", () => {
        post.children[post.children.length-1].click();
    });
});

document.querySelectorAll("article .intro").forEach(intro => {
    intro.innerHTML = intro.innerText;
    intro.innerText = intro.innerText.split("\n\n")[0];
});

Vue.createApp({
    data() {
        return {
            general: true,
            business: false,
            banks: false,
            financial: false,
            market: false,
            politics: false
        }
    },
    methods: {
        showGeneral() {
            this.business = this.banks = this.financial = this.market = this.politics = false;
            this.general = true;
        },
        showBusiness() {
            this.general = this.banks = this.financial = this.market = this.politics = false;
            this.business = true;
        },
        showBanks() {
            this.general = this.business = this.financial = this.market = this.politics = false;
            this.banks = true;
        },
        showFinancial() {
            this.general = this.banks = this.business = this.market = this.politics = false;
            this.financial = true;
        },
        showMarket() {
            this.general = this.banks = this.financial = this.business = this.politics = false;
            this.market = true;
        },
        showPolitics() {
            this.general = this.banks = this.financial = this.market = this.business = false;
            this.politics = true;
        }
    }
}).mount("#categories");