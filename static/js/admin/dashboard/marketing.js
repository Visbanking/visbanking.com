const app = Vue.createApp({
	data() {
		return {
			newsDigest: true,
			newsletter: false,
			create: false,
			edit: false,
			remove: false,
			loading: false
		}
	},
	methods: {
		showSection(sectionId) {
			this.showLoader();
			switch (sectionId) {
				case "newsDigest":
					this.showNewsDigest();
					break;
				case "newsletter":
					this.showNewsletter();
					break;
			}
			this.getSectionData(sectionId)
			.then(sectionData => {
				switch (sectionId) {
					case "newsDigest":
						document.querySelector("aside.data").className = "data newsDigest";
						this.renderNewsDigestSection(sectionData);
						break;
					case "newsletter":
						document.querySelector("aside.data").className = "data newsletter";
						this.renderNewsletterSection(sectionData);
						break;
				}
			})
			.catch(err => {
				if (err === "Admin not logged in") window.location.href = "/admin/logout";
			})
			.finally(() => {
				this.hideLoader();
			});
		},
		showNewsDigest() {
			this.newsletter = false;
			this.newsDigest = true;
		},
		showNewsletter() {
			this.newsDigest = false;
			this.newsletter = true;
		},
		showLoader() {
			this.loading = true;
		},
		hideLoader() {
			this.loading = false;
		},
		async getSectionData(sectionId) {
			let sectionData = {};
			switch (sectionId) {
				case "newsDigest":
					sectionData = await fetch("/admin/dashboard/marketing/newsDigest");
					break;
				case "newsletter":
					sectionData = await fetch("/admin/dashboard/marketing/newsletter");
					break;
			}
			const data = await sectionData.json();
			if (data.error) throw data.error;
			return data;
		},
		renderTemplate(templateString, templateData) {
			if (typeof templateString !== "string" || typeof templateData !== "object") throw new TypeError("Argument 'templateString' and/or 'templateData' not of expected type.");
			if (!templateString.trim()) throw new RangeError("Argument 'templateString' cannot be an empty string");
			for (const key in templateData) templateString = templateString.replaceAll(`{{${key}}}`, templateData[key] || "N/A");
			return templateString;
		},
		renderNewsDigestSection(sectionData) {
			const { data } = sectionData;
			const newsDigestSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				newsDigestSectionHTMLContentArray.push(this.renderTemplate(newsDigestSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = newsDigestSectionHTMLContentArray.join("");
		},
		renderNewsletterSection(sectionData) {
			const { data } = sectionData;
			const newsletterSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				newsletterSectionHTMLContentArray.push(this.renderTemplate(newsDigestSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = newsletterSectionHTMLContentArray.join("");
		}
	}
}).mount("body > main");

const newsDigestSectionTemplate = `
	<p>
		<span>{{Name}}</span>
		<span>{{Email}}</span>
		<span>{{Company}}</span>
	</p>
`;

window.onload = app.showSection("newsDigest");