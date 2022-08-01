function parseJwt(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(atob(base64).split("").map((c) => {
		return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(""));
	return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
	const authToken = parseJwt(response.credential);
	if (window.location.pathname.includes("signup"))
		window.location.href = `/signup/google?iss=${authToken.iss}&aud=${authToken.aud}&fname=${authToken.given_name}&lname=${authToken.family_name}&email=${authToken.email}&photo=${authToken.picture}&p=${authToken.sub}&tier=${document.querySelector("input[type='hidden']").value}`;
	else if (window.location.pathname.includes("login"))
		window.location.href = `/login/google?iss=${authToken.iss}&aud=${authToken.aud}&fname=${authToken.given_name}&lname=${authToken.family_name}&email=${authToken.email}&photo=${authToken.picture}&p=${authToken.sub}`;
	else if (window.location.pathname === "/me")
		window.location.href = `/me/connect/google?iss=${authToken.iss}&aud=${authToken.aud}&email=${authToken.email}`;
}

function renderGoogleSignInClient() {
	google.accounts.id.initialize({
		client_id: "289393190598-ak6gg5347d68it6fu6b7getf9njhsdoa.apps.googleusercontent.com",
		callback: handleCredentialResponse,
	});
	google.accounts.id.renderButton(
		document.getElementById("gsiButton"),
		{ size: "large", type: "icon", text: "Continue with", theme: "outline", shape: "circle" } // customization attributes
	);
	if (window.location.pathname === "/login") google.accounts.id.prompt(); // also display the One Tap dialog
}

window.onload = renderGoogleSignInClient;