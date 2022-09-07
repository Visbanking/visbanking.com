const { DataTypes, Model } = require("sequelize");
const hash = require("hash.js");
const connection = require("../data/database/usersDatabase");
require("dotenv").config();

class Admin extends Model {}

Admin.init({
	ID: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") !== null) throw new Error("Cannot set Admin ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Username: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newUsername) {
			this.setDataValue("Username", newUsername);
		}
	},
	Password: {
		type: DataTypes.STRING(200),
		allowNull: false,
		defaultValue: hash.sha512().update(process.env.DEFAULT_ADMIN_PASS).digest("hex"),
		validate: {
			notEmpty: true
		},
		set(newPass) {
			const newPassword = hash.sha512().update(newPass).digest("hex");
			this.setDataValue("Password", newPassword);
		}
	}
}, {
	sequelize: connection,
	modelName: "Admin",
	tableName: "Admins",
	createdAt: false,
	updatedAt: false
});

module.exports = Admin;