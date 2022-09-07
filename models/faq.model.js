const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class FAQ extends Model {}

FAQ.init({
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
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Question ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Question: {
		type: DataTypes.TEXT("medium"),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newQuestion) {
			this.setDataValue("Question", newQuestion);
		}
	},
	Answer: {
		type: DataTypes.TEXT("medium"),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newAnswer) {
			this.setDataValue("Answer", newAnswer);
		}
	},
	Category: {
		type: DataTypes.ENUM({
			values: ["Product", "Services", "Payment", "Account", "Support"]
		}),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newCategory) {
			this.setDataValue("Category", newCategory);
		}
	}
}, {
	sequelize: connection,
	modelName: "FAQ",
	tableName: "Questions",
	createdAt: false,
	updatedAt: false
});

module.exports = FAQ;