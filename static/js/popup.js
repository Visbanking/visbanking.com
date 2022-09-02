function disableSubmitwhileReset5070757000001172001() {
	let submitbutton = document.getElementById("formsubmit5070757000001172001");
	if (document.getElementById("privacyTool5070757000001172001") !== null || document.getElementById("consentTool") !== null) {
		submitbutton.disabled = true;
		submitbutton.style.opacity = "0.5;";
	} else {
		submitbutton.removeAttribute("disabled");
	}
}

function checkMandatory5070757000001172001() {
	let mndFields = new Array("First Name", "Last Name", "Email");
	let fldLangVal = new Array("First Name", "Last Name", "Email");
	let i;
	let mndFieldslength = mndFields.length;
	let fieldObj;
	for (i = 0; i < mndFieldslength; i++) {
		fieldObj = document.forms.BiginWebToContactForm5070757000001172001[mndFields[i]];
		if (fieldObj) {
			if (fieldObj.value.replace(/^s+|s+$/g, "").length === 0) {
				if (fieldObj.type === "file") {
					alert("Please select a file to upload.");
					fieldObj.focus();
					return false;
				}
				alert(fldLangVal[i] + " cannot be empty.");
				fieldObj.focus();
				return false;
			} else if (fieldObj.nodeName === "SELECT") {
				if (fieldObj.options[fieldObj.selectedIndex].value === "-None-") {
					alert(fldLangVal[i] + " cannot be none.");
					fieldObj.focus();
					return false;
				}
			} else if (fieldObj.type === "checkbox") {
				if (fieldObj.checked === false) {
					alert("Please accept " + fldLangVal[i]);
					fieldObj.focus();
					return false;
				}
			}
			if (fieldObj.name === "Last Name" && fieldObj.value) {
				name = fieldObj.value;
			}
		}
	}
	return true;
}

function validateFileUpload() {
	let e = document.getElementById("theFile"),
		t = 0;
	if (e) {
		if (e.files.length > 3) return alert("You can upload a maximum of three files at a time."), !1;
		if ("files" in e) {
			let i = e.files.length;
			if (0 !== i) {
				for (let o = 0; o < i; o++) {
					let a = e.files[o];
					"size" in a && (t += a.size);
				}
				if (t > 20971520) return alert("Total file(s) size should not exceed 20MB."), !1;
			}
		}
	}
	return !0;
}

function closePopUp() {
	document.querySelector(".bgn-wf-bg").style.display = "none";
	document.querySelector(".bgn-wf-exit").style.display = "none";
	document.querySelector(".bgn-wf-wrapper").style.display = "none";
	document.cookie = "popUpSubmitted=1;";
}