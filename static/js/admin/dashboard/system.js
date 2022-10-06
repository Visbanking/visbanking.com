const app = Vue.createApp({
	data() {
		return {
			profile: true,
			admins: false,
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
				case "profile":
					this.showProfile();
					break;
				case "admins":
					this.showAdmins();
					break;
			}
			this.getSectionData(sectionId)
			.then(sectionData => {
				switch (sectionId) {
					case "profile":
						document.querySelector("aside.data").className = "data profile";
						this.renderProfileSection(sectionData);
						break;
					case "admins":
						document.querySelector("aside.data").className = "data admins";
						this.renderAdminsSection(sectionData);
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
		showProfile() {
			this.admins = false;
			this.profile = true;
		},
		showAdmins() {
			this.profile = false;
			this.admins = true;
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
				case "profile":
					sectionData = await fetch("/admin/dashboard/system/profile");
					break;
				case "admins":
					sectionData = await fetch("/admin/dashboard/system/admins");
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
		renderProfileSection(sectionData) {
			const { data } = sectionData;
			const profileSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				profileSectionHTMLContentArray.push(this.renderTemplate(adminsSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = profileSectionHTMLContentArray.join("");
		},
		renderAdminsSection(sectionData) {
			const { data } = sectionData;
			const adminsSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				adminsSectionHTMLContentArray.push(this.renderTemplate(adminsSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = adminsSectionHTMLContentArray.join("");
		},
		loadAppStatusSection() {
			window.open("/admin/dashboard/system/status", "Admin Dashboard - Visbanking", "popup,width=750,height=500,top=100,left=200");
		}
	}
}).mount("body > main");

const adminsSectionTemplate = `
	<p>
		<span>{{ID}}</span>
		<span>{{Username}}</span>
	</p>
`;

window.onload = app.showSection("profile");