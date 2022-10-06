const app = Vue.createApp({
	data() {
		return {
			// users: true,
			academics: true,
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
				case "users":
					this.showProfile();
					break;
				case "academics":
					this.showAdmins();
					break;
			}
			this.getSectionData(sectionId)
			.then(sectionData => {
				switch (sectionId) {
					case "users":
						document.querySelector("aside.data").className = "data users";
						this.renderUsersSection(sectionData);
						break;
					case "academics":
						document.querySelector("aside.data").className = "data academics";
						this.renderAcademicsSection(sectionData);
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
				case "users":
					sectionData = await fetch("/admin/dashboard/users/users");
					break;
				case "academics":
					sectionData = await fetch("/admin/dashboard/users/academics");
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
		renderUsersSection(sectionData) {},
		renderAcademicsSection(sectionData) {
			const { data } = sectionData;
			const academicsSectionHTMLContentArray = [];
			data.forEach(dataElement => {
				academicsSectionHTMLContentArray.push(this.renderTemplate(academicsSectionTemplate, dataElement));
			});
			document.querySelector("#panel aside.data").innerHTML = academicsSectionHTMLContentArray.join("");
		},
	}
}).mount("body > main");

const academicsSectionTemplate = `
	<p>
		<span>{{FirstName}}</span>
		<span>{{LastName}}</span>
		<span>{{Email}}</span>
	</p>
`;

window.onload = app.showSection("academics");