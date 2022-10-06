const app = Vue.createApp({
	data() {
		return {
			insights: true,
			faqs: false,
			create: false,
			edit: false,
			remove: false,
			loading: false
		}
	},
	methods: {
		showSection(sectionId) {
			this.hideForms();
			this.showLoader();
			switch (sectionId) {
				case "insights":
					this.showInsights();
					break;
				case "faqs":
					this.showFAQs();
					break;
			}
			this.getSectionData(sectionId)
			.then(sectionData => {
				switch (sectionId) {
					case "insights":
						document.querySelector("aside.data").className = "data insights";
						this.renderInsightsSection(sectionData);
						break;
					case "faqs":
						document.querySelector("aside.data").className = "data faqs";
						this.renderFAQsSection(sectionData);
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
		showInsights() {
			this.faqs = false;
			this.insights = true;
		},
		showFAQs() {
			this.insights = false;
			this.faqs = true;
		},
		showForm(formId) {
			this.hideForms();
			if (formId === "create") this.create = true;
			else if (formId === "edit") this.edit = true;
			else if (formId === "remove") this.remove = true;
		},
		hideForms() {
			this.create = this.edit = this.remove = false;
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
				case "insights":
					sectionData = await fetch("/admin/dashboard/content/insights");
					break;
				case "faqs":
					sectionData = await fetch("/admin/dashboard/content/faqs");
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
		renderInsightsSection(sectionData) {
			const { data } = sectionData;
			const insightsSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				insightsSectionHTMLContentArray.push(this.renderTemplate(insightsSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = insightsSectionHTMLContentArray.join("");
		},
		renderFAQsSection(sectionData) {
			const { data } = sectionData;
			const faqsSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				faqsSectionHTMLContentArray.push(this.renderTemplate(faqsSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = faqsSectionHTMLContentArray.join("");
		}
	}
}).mount("body > main");

const insightsSectionTemplate = `
	<p>
		<span>
			{{Title}}
			<a href="/insights/{{ID}}" target="_blank" title="Read Insight">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>
			Header Image
			<a href="https://visbanking.com{{Image}}" alt={{Title}} target="_blank" title="View Header Image">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>{{Topic}}</span>
		<span>{{Description}}</span>
		<span>{{Date}}</span>
		<span>{{Tags}}</span>
		<span>{{Keywords}}</span>
		<span>{{Author}}</span>
	</p>
`;

const faqsSectionTemplate = `
	<p>
		<span>{{Question}}</span>
		<span>{{Answer}}</span>
		<span>{{Category}}</span>
	</p>
`;

window.onload = app.showSection("insights");