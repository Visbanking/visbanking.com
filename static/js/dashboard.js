const app = Vue.createApp({
    data() {
        return {
            profile: true,
            admins: false,
            insights: false,
            members: false,
            questions: false,
            create: false,
            edit: false,
            remove: false,
            loading: true
        }
    },
    methods: {
        async getSectionData(section) {
            let sectionData = {};
            switch (section) {
                case 'profile':
                    sectionData = await fetch('/admin/dashboard/profile');
                    break;
                case 'admins':
                    sectionData = await fetch('/admin/dashboard/admins');
                    break;
                case 'insights':
                    sectionData = await fetch('/admin/dashboard/insights');
                    break;
                case 'members':
                    sectionData = await fetch('/admin/dashboard/members');
                    break;
                case 'questions':
                    sectionData = await fetch('/admin/dashboard/questions');
                    break;
            }
            const data = await sectionData.json();
            if (data.error) throw data.error;
            return data;
        },
        renderPanelSection(section, data) {
            if (data.hasOwnProperty('success') && data.success) {
                switch (section) {
                    case 'profile':
                        this.renderProfilePanelSection(data);
                        break;
                    case 'admins':
                        this.renderAdminsPanelSection(data);
                        break;
                    case 'insights':
                        this.renderInsightsPanelSection(data);
                        break;
                    case 'members':
                        this.renderMembersPanelSection(data);
                        break;
                    case 'questions':
                        this.renderQuestionsPanelSection(data);
                        break;
                }
            }
        },
        renderProfilePanelSection(data) {
            const profileSection = document.querySelector(`#panel .profile > div`);
            const profileSectionHTMLContent = [];
            data.data.forEach(dataRecord => {
                profileSectionHTMLContent.push(`
                    <p class="data">
                        <span>${dataRecord.ID}</span>
                        <span>${dataRecord.Username}</span>
                    </p>
                `);
            });
            profileSection.innerHTML = profileSectionHTMLContent.join('');
        },
        renderAdminsPanelSection(data) {
            const adminsSection = document.querySelector(`#panel .admins > div`);
            const adminsSectionHTMLContent = [];
            data.data.forEach(dataRecord => {
                adminsSectionHTMLContent.push(`
                    <p class="data">
                        <span>${dataRecord.ID}</span>
                        <span>${dataRecord.Username}</span>
                    </p>
                `);
            });
            adminsSection.innerHTML = adminsSectionHTMLContent.join('');
        },
        renderInsightsPanelSection(data) {
            const insightsSection = document.querySelector(`#panel .insights > div`);
            const insightsSectionHTMLContent = [];
            data.data.forEach(dataRecord => {
                insightsSectionHTMLContent.push(`
                    <p class="data">
                        <span>
                            ${dataRecord.Title}
                            <a href="/insights/insight/${dataRecord.ID}" target="_blank" title="Read Insight">
                                <sup class="bi-box-arrow-up-right"></sup>
                            </a>
                        </span>
                        <span>
                            Header Image
                            <a href="${dataRecord.Image}" target="_blank" title="View Header Image">
                                <sup class="bi-box-arrow-up-right"></sup>
                            </a>
                        </span>
                        <span>${dataRecord.Topic}</span>
                        <span>${dataRecord.Description || "N/A"}</span>
                        <span>${new Date(dataRecord.Date).toDateString()}</span>
                        <span>${dataRecord.Tags || "N/A"}</span>
                        <span>${dataRecord.Keywords || "N/A"}</span>
                        <span>${dataRecord.Author}</span>
                    </p>
                `);
            });
            insightsSection.innerHTML = insightsSectionHTMLContent.join('');
        },
        renderMembersPanelSection(data) {
            const membersSection = document.querySelector(`#panel .members > div`);
            const membersSectionHTMLContent = [];
            data.data.forEach(dataRecord => {
                membersSectionHTMLContent.push(`
                    <p class="data">
                        <span>${dataRecord.Name}</span>
                        <span>
                            ${dataRecord.Email}
                            <a href="mailto:${dataRecord.Email}" target="_blank" title="Email">
                                <sup class="bi-box-arrow-up-right"></sup>
                            </a>
                        </span>
                        <span>${dataRecord.Title}</span>
                        <span>
                            ${dataRecord.LinkedIn.slice(0, -1)}
                            <a href="${dataRecord.LinkedIn}" target="_blank" title="View LinkedIn Profile">
                                <sup class="bi-box-arrow-up-right"></sup>
                            </a>
                        </span>
                        <span>
                            Profile Picture
                            <a href="${dataRecord.Photo}" target="_blank" title="View Profile Image">
                                <sup class="bi-box-arrow-up-right"></sup>
                            </a>
                        </span>
                    </p>
                `);
            });
            membersSection.innerHTML = membersSectionHTMLContent.join('');
        },
        renderQuestionsPanelSection(data) {
            const questionsSection = document.querySelector(`#panel .questions > div`);
            const questionsSectionHTMLContent = [];
            data.data.forEach(dataRecord => {
                questionsSectionHTMLContent.push(`
                    <p class="data">
                        <span>${dataRecord.Question}</span>
                        <span>${dataRecord.Answer}</span>
                        <span>${dataRecord.Category}</span>
                    </p>
                `);
            });
            questionsSection.innerHTML = questionsSectionHTMLContent.join('');
        },
        showSection(section) {
            this.hideForms();
            this.showLoader();
            this.hideErrorMessage();
            this.profile = this.admins = this.insights = this.members = this.questions = false;
            this[section] = true;
            this.getSectionData(section)
            .then(sectionData => {
                this.renderPanelSection(section, sectionData);
            })
            .catch(err => {
                if (err === "Admin not logged in") window.location.href = "/admin/logout";
                else this.showErrorMessage(err);
            })
            .finally(() => {
                this.hideLoader();
            });
        },
        showForm(form) {
            this.hideForms();
            this[form] = true;
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
        redirectToInsightCreation() {
            window.location.href = "/admin/dashboard/insights/create";
        },
        redirectToInsightEditing() {
            window.location.href = `/admin/dashboard/insights/edit`;
        },
        previewImage(event) {
            const image = event.target.files[0];
            const imageElement = document.querySelector("img#preview");
            if (image) imageElement.src = URL.createObjectURL(image);
            else imageElement.src = "";
        },
        showErrorMessage(errorData) {
            document.querySelector("aside.error#requestError").classList.add("active");
            document.querySelector("aside.error#requestError h4").innerHTML = errorData.summary;
            document.querySelector("aside.error#requestError p").innerHTML = `${errorData.detail.code}: ${errorData.detail.sqlMessage} (${errorData.detail.sql})`;
        },
        hideErrorMessage() {
            document.querySelector("aside.error#requestError").classList.remove("active");
        }
    }
}).mount('#dashboard');

window.onload = app.showSection('profile');

setTimeout(() => {
    document.querySelector("p.message").innerHTML = '';
    document.querySelector("p.message").dataset.contentExist = false;
}, 10000);