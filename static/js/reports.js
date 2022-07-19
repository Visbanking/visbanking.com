const reportType = window.location.pathname.split("/").slice(2)[0];

if (reportType) document.querySelector(`.reportTypes a[data-report-type="${reportType}"]`)?.classList.add("active");