let timer = setInterval(() => {
    intro.carouselRight();
}, 10000);

const intro = Vue.createApp({
    data() {
        return {
            carousel: 1, 
        }
    },
    methods: {
        carouselLeft() {
            this.carousel===1?this.carousel=3:this.carousel--;
            clearInterval(timer);
            timer = setInterval(() => {
                this.carouselRight();
            }, 10000);
        },
        carouselRight() {
            this.carousel===3?this.carousel=1:this.carousel++;
            clearInterval(timer);
            timer = setInterval(() => {
                this.carouselRight();
            }, 10000);
        }
    }
}).mount("#intro");

const capabilities = Vue.createApp({
    data() {
        return {
            tabs: [true, false, false]
        }
    },
    methods: {
        show(tab) {
            this.tabs[this.tabs.indexOf(true)] = false;
            if (tab === "about") {
                this.tabs[0] = !this.tabs[0];
            } else if (tab === "services") {
                this.tabs[1] = !this.tabs[1];
            } else if (tab === "insights") {
                this.tabs[2] = !this.tabs[2];
            }
        }
    }
}).mount("#capabilities");

document.querySelector("#newsletter aside a").addEventListener("mouseenter", () => {
    document.querySelector("#newsletter aside a i").classList.add("active");
});

document.querySelector("#newsletter aside a").addEventListener("mouseleave", () => {
    document.querySelector("#newsletter aside a i").classList.remove("active");
});

document.querySelectorAll("#insights article").forEach((article) => {
    article.addEventListener("mouseenter", () => {
        article.classList.add("active");
    });
    article.addEventListener("mouseleave", () => {
        article.classList.remove("active");
    });
});