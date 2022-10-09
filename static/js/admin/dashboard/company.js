const app = Vue.createApp({
	data() {
		return {
			members: true,
			services: false,
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
				case "members":
					this.showMembers();
					break;
				case "services":
					this.showServices();
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
			this.services = false;
			this.members = true;
		},
		showServices() {
			this.members = false;
			this.services = true;
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
		previewImage(event) {
			const image = event.target.files[0];
			const imageElement = document.querySelector("img#preview");
			if (image) imageElement.src = URL.createObjectURL(image);
			else imageElement.src = "";
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

window.onload = app.showSection("members");