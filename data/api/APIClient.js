const { default: axios } = require("axios");
const generateAuthorizationToken = require("./generateAuthorizationToken");

module.exports = class APIClient {
	static get token() {
		return generateAuthorizationToken({
			name: process.env.VISBANKING_API_APP_NAME,
			id: process.env.VISBANKING_API_CLIENT_ID,
			secret: process.env.VISBANKING_API_CLIENT_SECRET
		});
	}
	static async get(urlEndpoint, headers={}) {
		headers.Authorization = `Bearer ${APIClient.token}`;
		const { data: result } = await axios.get(urlEndpoint, {
			headers: headers,
			baseURL: "http://localhost:8080"
		});
		return result;
	}
	static async del(urlEndpoint, headers={}) {
		headers.Authorization = `Bearer ${APIClient.token}`;
		const { data:result } = await axios.delete(urlEndpoint, {
			headers: headers,
			baseURL: "http://localhost:8080"
		});
		return result;
	}
};