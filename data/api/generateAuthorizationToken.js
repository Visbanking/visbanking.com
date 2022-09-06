const { sign } = require("jsonwebtoken")

module.exports = (authOptions) => {
	return sign(authOptions, process.env.JWT_SIGNATURE, {
		issuer: "Visbanking",
		audience: "Visbanking"
	});
};