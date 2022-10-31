const app = Vue.createApp({
	data() {
		return {
			members: true,
			services: false,
			pressReleases: false,
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
			this.cleanDataSection();
			switch (sectionId) {
				case "members":
					this.showMembers();
					break;
				case "services":
					this.showServices();
					break;
				case "pressReleases":
					this.showPressReleases();
					break;
			}
			this.getSectionData(sectionId)
			.then(sectionData => {
				switch (sectionId) {
					case "members":
						document.querySelector("aside.data").className = "data members";
						this.renderMembersSection(sectionData);
						break;
					case "services":
						document.querySelector("aside.data").className = "data services";
						this.renderServicesSection(sectionData);
						break;
					case "pressReleases":
						document.querySelector("aside.data").className = "data press";
						this.renderPressReleasesSection(sectionData);
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
		showMembers() {
			this.services = this.pressReleases = false;
			this.members = true;
		},
		showServices() {
			this.members = this.pressReleases = false;
			this.services = true;
		},
		showPressReleases() {
			this.members = this.services = false;
			this.pressReleases = true;
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
				case "members":
					sectionData = await fetch("/admin/dashboard/company/members");
					break;
				case "services":
					sectionData = await fetch("/admin/dashboard/company/services");
					break;
				case "pressReleases":
					sectionData = await fetch("/admin/dashboard/company/pressReleases");
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
		renderMembersSection(sectionData) {
			const { data } = sectionData;
			const membersSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				membersSectionHTMLContentArray.push(this.renderTemplate(membersSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = membersSectionHTMLContentArray.join("");
		},
		renderServicesSection(sectionData) {
			const { data } = sectionData;
			const servicesSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				servicesSectionHTMLContentArray.push(this.renderTemplate(servicesSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = servicesSectionHTMLContentArray.join("");
		},
		renderPressReleasesSection(sectionData) {
			const { data } = sectionData;
			const pressReleasesSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				pressReleasesSectionHTMLContentArray.push(this.renderTemplate(pressReleasesSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = pressReleasesSectionHTMLContentArray.join("");
		},
		previewImage(event) {
			const image = event.target.files[0];
			const imageElement = document.querySelector("img#preview");
			if (image) imageElement.src = URL.createObjectURL(image);
			else imageElement.src = "";
		},
		cleanDataSection() {
			document.querySelector("#panel aside.data").innerHTML = "";
		}
	}
}).mount("body > main");

const membersSectionTemplate = `
	<p>
		<span>{{Name}}</span>
		<span>
			{{Email}}
			<a href="mailto:{{Email}}" target="_blank" title="Email">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>{{Title}}</span>
		<span>
			LinkedIn
			<a href="{{LinkedIn}}" target="_blank" title="View LinkedIn Profile">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>
			Profile Picture
			<a href="{{Photo}}" target="_blank" title="View Profile Image">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
	</p>
`;

const servicesSectionTemplate = `
	<p>
		<span>
			{{ID}}
			<a href="/services/{{ID}}" target="_blank" title="View Service Page">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>{{Name}}</span>
		<span>{{Description}}</span>
	</p>
`;

const pressReleasesSectionTemplate = `
	<p>
		<span>
			{{Title}}
			<a href="/press/{{ID}}" target="_blank" title="Read Press Release">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>
			Header Image
			<a href="https://visbanking.com{{Image}}" alt={{Title}} target="_blank" title="View Header Image">
				<sup class="bi-box-arrow-up-right"></sup>
			</a>
		</span>
		<span>{{Description}}</span>
		<span>{{Date}}</span>
		<span>{{Tags}}</span>
		<span>{{Keywords}}</span>
		<span>{{Author}}</span>
	</p>
`;

window.onload = app.showSection("members");