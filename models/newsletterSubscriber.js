const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class NewsletterSubscriber extends Model {};

NewsletterSubscriber.init({
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
			if (this.getDataValue("ID") !== null) throw new Error("Cannot set NewsletterSubscriber ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Address1: {
		type: DataTypes.STRING(100),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	Address2: {
		type: DataTypes.STRING(100),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	City: {
		type: DataTypes.STRING(100),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	State: {
		type: DataTypes.STRING(150),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	Country: {
		type: DataTypes.STRING(200),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	Phone: {
		type: DataTypes.STRING(20),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	Role: {
		type: DataTypes.ENUM({
			values: ["Investor", "Issuer", "Intermediary", "Analyst/Researcher", "Regulator", "Other"]
		}),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	FirstName: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	LastName: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	Company: {
		type: DataTypes.STRING(100),
		allowNull: true,
		validate: {
			notEmpty: true
		}
	},
	Email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		validate: {
			notEmpty: true,
			isEmail: true
		}
	}
}, {
	sequelize: connection,
	modelName: "NewsletterSubscriber",
	tableName: "NewsletterSubscribers",
	createdAt: false,
	updatedAt: false
});

module.exports = NewsletterSubscriber;