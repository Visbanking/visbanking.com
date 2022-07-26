const banksArray = [ ...document.querySelectorAll(".report") ];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const page = !document.querySelector("select#city") ? "city" : !document.querySelector("select#state") ? "state" : "general";

const showAllBanks = () => {
	document.querySelectorAll(".report").forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByName = (bankName) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig"))) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByState = (stateAbbr) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-state='" + stateAbbr + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-state='" + stateAbbr + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByCity = (cityName) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-city='" + cityName + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-city='" + cityName + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByStatus = (status) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-status='" + status + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-status='" + status + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterByNameAndState = (bankName, stateAbbr) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.state===stateAbbr) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByNameAndCity = (bankName, cityName) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.city===cityName) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByNameAndStatus = (bankName, status) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.status===status) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByCityAndState = (cityName, stateAbbr) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-city='" + cityName + "'][data-state='" + stateAbbr + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-city='" + cityName + "'][data-state='" + stateAbbr + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByCityAndStatus = (cityName, status) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-city='" + cityName + "'][data-status='" + status + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-city='" + cityName + "'][data-status='" + status + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByStateAndStatus = (stateAbbr, status) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-state='" + stateAbbr + "'][data-status='" + status + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-state='" + stateAbbr + "'][data-status='" + status + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByNameStateAndCity = (bankName, stateAbbr, cityName) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.state===stateAbbr && bank.dataset.city===cityName) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByNameStateAndStatus = (bankName, stateAbbr, status) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.state===stateAbbr && bank.dataset.status===status) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByNameCityAndStatus = (bankName, cityName, status) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp})`).join("")}.*`, "ig")) && bank.dataset.city===cityName && bank.dataset.status===status) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const filterBanksByCityStateAndStatus = (cityName, stateAbbr, status) => {
	const nonMatchingBanks = document.querySelectorAll(".report:not([data-city='" + cityName + "'][data-state='" + stateAbbr + "'][data-status='" + status + "'])");
	const matchingBanks = document.querySelectorAll(".report[data-city='" + cityName + "'][data-state='" + stateAbbr + "'][data-status='" + status + "']");
	nonMatchingBanks.forEach(bank => {
		bank.classList.remove("show");
	});
	matchingBanks.forEach(bank => {
		bank.classList.add("show");
	});
};

const filterBanksByNameStateCityAndStatus = (bankName, stateAbbr, cityName, status) => {
	const matchingBanks = [];
	banksArray.filter(bank => {
		if (bank.dataset.name.toLowerCase().match(new RegExp(`${bankName.toLowerCase().split(" ").map(exp => `(?=.*${exp.trim()})`).join("")}.*`, "ig")) && bank.dataset.state===stateAbbr && bank.dataset.city===cityName && bank.dataset.status===status) {
			matchingBanks.push(bank);
		}
	});
	banksArray.forEach(bank => bank.classList.remove("show"));
	matchingBanks.forEach(bank => bank.classList.add("show"));
};

const showBankFilterResultMessage = () => {
	if (!document.querySelector(".report:not(.show)")) return document.querySelector("p.filterMessage").innerHTML = "";
	const filteredBanksExist = new Boolean(document.querySelector(".report.show"));
	filteredBanksExist.valueOf() ? document.querySelector("p.filterMessage").innerHTML = "<span class=\"filtered\">CLEAR SOME FILTERS TO SEE MORE RESULTS</span>" : document.querySelector("p.filterMessage").innerHTML = "<span class=\"noResults\">NO RESULTS FOR YOUR FILTERS</span>";
};

const clearBankFilters = () => {
	document.querySelectorAll(".filter").forEach(filter => filter.value = "");
};

const showClearFiltersButton = () => {
	document.querySelector(".search #clear").classList.add("show");
};

const hideClearFiltersButton = () => {
	document.querySelector(".search #clear").classList.remove("show");
};

const filterBanks = (filteringOptions) => {
	const { cityName, stateAbbr, status, bankName } = filteringOptions;
	if (cityName || stateAbbr || status || bankName) {
		showClearFiltersButton();
	} else {
		hideClearFiltersButton();
	}
	if (cityName && stateAbbr && status && bankName) {
		filterBanksByNameStateCityAndStatus(bankName, stateAbbr, cityName, status);
	} else if (cityName && stateAbbr && status) {
		filterBanksByCityStateAndStatus(cityName, stateAbbr, status);
	} else if (bankName && stateAbbr && cityName) {
		filterBanksByNameStateAndCity(bankName, stateAbbr, cityName);
	} else if (bankName && stateAbbr && status) {
		filterBanksByNameStateAndStatus(bankName, stateAbbr, status);
	} else if (bankName && cityName && status) {
		filterBanksByNameCityAndStatus(bankName, cityName, status);
	} else if (bankName && stateAbbr) {
		filterByNameAndState(bankName, stateAbbr);
	} else if (bankName && cityName) {
		filterBanksByNameAndCity(bankName, cityName);
	} else if (bankName && status) {
		filterBanksByNameAndStatus(bankName, status);   
	} else if (cityName && stateAbbr) {
		filterBanksByCityAndState(cityName, stateAbbr);
	} else if (cityName && status) {
		filterBanksByCityAndStatus(cityName, status);
	} else if (stateAbbr && status) {
		filterBanksByStateAndStatus(stateAbbr, status);
	} else if (cityName) {
		filterBanksByCity(cityName);
	} else if (stateAbbr) {
		filterBanksByState(stateAbbr);
	} else if (status) {
		filterBanksByStatus(status);
	} else if (bankName) {
		filterBanksByName(bankName);
	} else {
		showAllBanks();
	}
	showBankFilterResultMessage();
};

const getElementYCoords = (elementQuerySelector) => {
	const y = document.querySelector(elementQuerySelector).offsetTop;
	const offset = document.querySelector(".report").offsetHeight*1.5;
	return y + offset;
};

const scrollToLetter = (letter) => {
	const yCoord = (letter === "#" ? getElementYCoords(".report") : getElementYCoords(`[data-name-initial="${letter}"]`));
	window.scrollTo(0, yCoord);
};

const handleBankFilterChange = () => {
	const cityName = document.querySelector("select#city")?.value;
	const stateAbbr = document.querySelector("select#state")?.value;
	const status = document.querySelector("select#status")?.value;
	const bankName = document.querySelector("input#bankName")?.value;
	filterBanks({ cityName, stateAbbr, status, bankName });
};

const handleFiltersClear = () => {
	showAllBanks();
	hideClearFiltersButton();
	clearBankFilters();
};

const handleBrowseBarLetterClick = (event) => {
	event.preventDefault();
	const letter = event.target.innerText;
	scrollToLetter(letter);
};

const parseSearchParams = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const status = searchParams.get("status");
	const bankName = searchParams.get("bankName");
	return {
		status: status ? status[0].toUpperCase()+status.slice(1) : "",
		bankName: bankName
	};
};

const updateStatusFilterOnLoad = (status) => {
	const index = ["", "Active", "Inactive"].indexOf(status);
	if (index !== -1) document.querySelector("select#status").selectedIndex = index;
	else document.querySelector("select#status").selectedIndex = 0;
};

const updateFiltersOnLoad = () => {
	const { status, bankName } = parseSearchParams();
	if (status) updateStatusFilterOnLoad(status);
	if (bankName) document.querySelector("input#bankName").value = bankName;
	if (status || bankName) filterBanks({ status, bankName });
};

document.querySelectorAll(".filter").forEach(select => {
	select.addEventListener("input", handleBankFilterChange);
});

document.querySelector("button#clear").addEventListener("click", handleFiltersClear);

document.querySelectorAll(".browse a").forEach(letter => {
	letter.addEventListener("click", handleBrowseBarLetterClick);
});

window.onload = updateFiltersOnLoad;