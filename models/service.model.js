const { DataTypes, Model } = require("sequelize");
const connection = require("./../data/database/usersDatabase");

class Service extends Model {};

Service.init({
	ID: {
		type: DataTypes.STRING(20),
		allowNull: false,
		primaryKey: true,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Service ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Name: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newServiceName) {
			this.setDataValue("Name", newServiceName);
		}
	},
	Description: {
		type: DataTypes.STRING(600),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newServiceDescription) {
			this.setDataValue("Description", newServiceDescription);
		}
	}
}, {
	sequelize: connection,
	modelName: "Service",
	tableName: "Services",
	createdAt: false,
	updatedAt: false
});

module.exports = Service;