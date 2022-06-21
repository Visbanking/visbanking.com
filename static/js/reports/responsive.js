window.onload = window.onresize = () => {
	if (window.innerWidth < 768) {
		const interval = setInterval(() => {
			let tables = document.querySelectorAll("div.datatables"),
				tablesOverflowSetCount = 0;
			let charts = document.querySelectorAll("div.highcharts-container"),
				chartsOverflowSetCount = 0;
			tables.forEach((table) => {
				table.style.overflow = "auto";
				tablesOverflowSetCount++;
			});
			charts.forEach((chart) => {
				chart.style.overflowX = "auto";
				chart.style.width = window.innerWidth - 40 + "px";
				chartsOverflowSetCount++;
			});
			if (tablesOverflowSetCount === tables.length && chartsOverflowSetCount === charts.length) {
				clearInterval(interval);
			}
		});
	}
};
