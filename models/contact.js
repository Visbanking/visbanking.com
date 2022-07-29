const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class Contact extends Model {};

Contact.init({
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
			if (this.getDataValue("ID") !== null) throw new Error("Cannot set Contact ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Name: {
		type: DataTypes.STRING(250),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newName) {
			this.setDataValue("Name", newName);
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
			if (this.getDataValue("Email") && this.getDataValue("Email") !== value) throw new Error("Cannot set Contact Email after initialization");
			else this.setDataValue("Email", value);
		}
	},
	Message: {
		type: DataTypes.STRING(500),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newMessage) {
			this.setDataValue("Message", newMessage);
		}
	},
	Topic: {
		type: DataTypes.ENUM({
			values: ["General", "Sales", "Support"]
		}),
		allowNull: false,
		defaultValue: "General",
		validate: {
			notEmpty: true
		},
		set(newTopic) {
			this.setDataValue("Topic", newTopic);
		}
	},
	Phone: {
		type: DataTypes.STRING(20),
		allowNull: true,
		validate: {
			notEmpty: true
		},
		set(newPhoneNumber) {
			this.setDataValue("Phone", newPhoneNumber)
		}
	}
}, {
	sequelize: connection,
	modelName: "Contact",
	tableName: "Contacts",
	createdAt: false,
	updatedAt: false
});

module.exports = Contact;