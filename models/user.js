const { DataTypes, Model } = require("sequelize");
const hash = require("hash.js");
const connection = require("../data/database/usersDatabase");

class User extends Model {};

User.init({
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		validate: {
			notEmpty: true,
		},
		set(value) {
			if (this.getDataValue("ID") !== null) throw new Error("Cannot set User ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	FirstName: {
		type: DataTypes.STRING(50),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newFirstName) {
			this.setDataValue("FirstName", newFirstName);
		}
	},
	LastName: {
		type: DataTypes.STRING(50),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newLastName) {
			this.setDataValue("LastName", newLastName);
		}
	},
	Email: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(value) {
			if (this.getDataValue("Email") !== null) throw new Error("Cannot set User Email after initialization");
			else this.setDataValue("Email", value);
		}
	},
	Password: {
		type: DataTypes.STRING(200),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newPass) {
			const newPassword = hash.sha512().update(newPass).digest("hex");
			this.setDataValue("Password", newPassword);
		}
	},
	Tier: {
		type: DataTypes.ENUM({
			values: ["Free", "Professional", "Academic", "Premium", "Enterprise"]
		}),
		allowNull: false,
		defaultValue: "Free",
		validate: {
			notEmpty: true
		},
		set(newTier) {
			if (!["Free", "Professional", "Academic", "Premium", "Enterprise"].includes(newTier))
				throw new Error("Invalid tier");
			else this.setDataValue("Tier", newTier);
		}
	},
	Image: {
		type: DataTypes.STRING(150),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(newImageUrl) {
			this.setDataValue("Image", newImageUrl);
		}
	},
	Google: {
		type: DataTypes.STRING(250),
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(googleEmail) {
			this.setDataValue("Google", googleEmail);
		}
	},
	LinkedIn: {
		type: DataTypes.STRING(250),
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(linkedinEmail) {
			this.setDataValue("LinkedIn", linkedinEmail);
		}
	},
	Facebook: {
		type: DataTypes.STRING(250),
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(facebookEmail) {
			this.setDataValue("Facebook", facebookEmail);
		}
	},
	Recovery: {
		type: DataTypes.STRING(150),
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(recoveryId) {
			this.setDataValue("Recovery", recoveryId);
		}
	},
	Session_ID: {
		type: DataTypes.STRING(150),
		allowNull: true,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(sessionId) {
			this.setDataValue("Session_ID", sessionId);
		}
	},
	Signup_Code: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(signupCode) {
			this.setDataValue("Signup_Code", signupCode);
		}
	},
	Initial_Payment: {
		type: DataTypes.ENUM({
			values: ["Complete", "None"]
		}),
		allowNull: false,
		defaultValue: "Complete",
		validate: {
			notEmpty: true
		},
		set(paymentStatus) {
			this.setDataValue("Initial_Payment", paymentStatus);
		}
	},
	Date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		validate: {
			notEmpty: true,
			isDate: true
		},
		set(value) {
			if (this.getDataValue("Date") !== null) throw new Error("Cannot set User Date after initialization");
			else this.setDataValue("Date", value);
		}
	},
	NewsDigest: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: 0,
		validate: {
			notEmpty: true
		},
		set(subscriptionStatus) {
			this.setDataValue("NewsDigest", subscriptionStatus === "subscribed");
		}
	},
	Newsletter: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: 0,
		validate: {
			notEmpty: true
		},
		set(subscriptionStatus) {
			this.setDataValue("Newsletter", subscriptionStatus === "subscribed");
		}
	}
}, {
	sequelize: connection,
	modelName: "User",
	tableName: "Users",
	createdAt: false,
	updatedAt: false
});

module.exports = User;