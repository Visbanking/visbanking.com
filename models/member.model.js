const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class Member extends Model {}

Member.init({
	ID: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		unique: true,
		validate: {
			isInt: true,
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Member ID after initialization");
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
		set(newName) {
			this.setDataValue("Name", newName);
		}
	},
	Photo: {
		type: DataTypes.STRING(250),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Photo") && this.getDataValue("Photo") !== null) throw new Error("Cannot set Member Photo after initialization");
			else this.setDataValue("Photo", value);
		}
	},
	LinkedIn: {
		type: DataTypes.STRING(300),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newLinkedIn) {
			this.setDataValue("LinkedIn", newLinkedIn);
		}
	},
	Title: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newTitle) {
			this.setDataValue("Title", newTitle);
		}
	},
	Email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true,
			isEmail: true
		},
		set(newEmail) {
			this.setDataValue("Email", newEmail);
		}
	}
}, {
	sequelize: connection,
	modelName: "Member",
	tableName: "Members",
	createdAt: false,
	updatedAt: false
});

module.exports = Member;