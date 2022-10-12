const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class NewsDigestSubscriber extends Model {}

NewsDigestSubscriber.init({
	ID: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Subscriber ID after initialization");
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
	Email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Email") && this.getDataValue("Email") !== null) throw new Error("Cannot set Subscriber Email after initialization");
			else this.setDataValue("Email", value);
		}
	},
	Company: {
		type: DataTypes.STRING(100),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(newCompany) {
			this.setDataValue("Company", newCompany);
		}
	},
	Name: {
		type: DataTypes.VIRTUAL,
		get() {
			return `${this.getDataValue("FirstName")} ${this.getDataValue("LastName")}`;
		},
		set(value) {
			throw new Error("Cannot set value of VIRTUAL property");
		}
	}
}, {
	sequelize: connection,
	modelName: "NewsDigestSubscriber",
	tableName: "NewsDigest",
	createdAt: false,
	updatedAt: false
});

module.exports = NewsDigestSubscriber;