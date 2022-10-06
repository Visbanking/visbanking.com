const { DataTypes, Model } = require("sequelize");
const connection = require("./../data/database/usersDatabase");

class ConversionLead extends Model {};

ConversionLead.init({
	ID: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		validate: {
			isInt: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Contact ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	FirstName: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newFirstName) {
			this.setDataValue("FirstName", newFirstName);
		}
	},
	LastName: {
		type: DataTypes.STRING(150),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(newLastName) {
			this.setDataValue("LastName", newLastName);
		}
	},
	Name: {
		type: DataTypes.VIRTUAL,
		get() {
			return `${this.getDataValue("FirstName")} ${this.getDataValue("LastName")}`;
		},
		set(value) {
			throw new Error("Cannot set value for VIRTUAL model field");
		}
	},
	Email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			isEmail: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Email") && this.getDataValue("Email") !== null) throw new Error("Cannot set Subscriber Email after initialization");
			else this.setDataValue("Email", value);
		}
	},
	Phone: {
		type: DataTypes.STRING(15),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(newPhoneNumber) {
			this.setDataValue("Phone", newPhoneNumber);
		}
	}
}, {
	sequelize: connection,
	modelName: "ConversionLead",
	tableName: "ConversionLeads",
	createdAt: false,
	updatedAt: false
});

module.exports = ConversionLead;