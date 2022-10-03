document.querySelectorAll("article.post").forEach(post => {
	post.addEventListener("click", () => {
		post.children[post.children.length-1].click();
	});
});

document.querySelectorAll("#latest .intro").forEach(intro => {
	intro.innerHTML = intro.innerText;
	intro.innerText = intro.innerText.split("\n\n")[0].slice(0, 140)+"...";
});

const postHeights = [];

document.querySelectorAll("#categories article.post").forEach(post => {
	postHeights.push(post.offsetHeight);
});

const maxPostHeight = Math.max(...postHeights);

document.querySelectorAll("#categories article.post").forEach(post => {
	post.style.height = `${maxPostHeight+22}px`;
});

const app = Vue.createApp({
	data() {
		return {
			activeSection: "general",
			page: 1,
			showNext: true
		};
	},
	methods: {
		showSection(sectionId) {
			if (sectionId !== this.activeSection) this.page = 1;
			let fetchEndpoint = `/insights?page=${this.page}`;
			if (sectionId === "general") this.activeSection = "general";
			else if (sectionId === "business") {
				this.activeSection = "business";
				fetchEndpoint += "&topic=Business";
			} else if (sectionId === "banks") {
				this.activeSection = "banks";
				fetchEndpoint += "&topic=Banks";
			} else if (sectionId === "financial") {
				this.activeSection = "financial";
				fetchEndpoint += "&topic=Financial";
			} else if (sectionId === "market") {
				this.activeSection = "market";
				fetchEndpoint += "&topic=Market";
			}
			fetch(fetchEndpoint)
			.then(res => res.json())
			.then(res => {
				if (res.message === "Insights were retrieved successfully") {
					const categoriesSectionHTMLContent = [];
					res.insights.forEach(insight => {
						let renderedPostTemplate = categoriesSectionPostTemplate;
						for (const key in insight) renderedPostTemplate = renderedPostTemplate.replaceAll(`{{${key}}}`, insight[key]);
						categoriesSectionHTMLContent.push(renderedPostTemplate);
					});
					document.querySelector("aside.articles").innerHTML = categoriesSectionHTMLContent.join("");
					document.querySelectorAll("article.post").forEach(post => {
						post.addEventListener("click", () => {
							post.children[post.children.length-1].click();
						});
					});
					if (res.insights.length < 15) this.showNext = false;
					else if (res.insights.length === 15) this.showNext = true;
				}
			})
			.catch(console.log);
		},
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
		loadPreviousPage() {
			this.page--;
			this.showSection(this.activeSection);
		},
		loadNextPage() {
			this.page++;
			this.showSection(this.activeSection);
		}
	}
}).mount("#categories");

const categoriesSectionPostTemplate = `
	<article class="post" id={{ID}}>
		<div>
			<img src="https://visbanking.com{{Image}}" alt={{Title}}>
		</div>
		<p class="title">{{Title}}</p>
		<p class="intro">{{Description}}</p>
		<a href="insights/{{ID}}">Read more &gt;&gt;</a>
	</article>
`;

document.onload = app.showSection("general");