const { DataTypes, Model } = require("sequelize");
const connection = require("../data/database/usersDatabase");

class Insight extends Model {}

Insight.init({
	ID: {
		type: DataTypes.STRING(150),
		allowNull: false,
		primaryKey: true,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("ID") && this.getDataValue("ID") !== null) throw new Error("Cannot set Insight ID after initialization");
			else this.setDataValue("ID", value);
		}
	},
	Title: {
		type: DataTypes.TEXT,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Title") && this.getDataValue("Title") !== null) throw new Error("Cannot set Insight Title after initialization");
			else this.setDataValue("Title", value);
		}
	},
	Body: {
		type: DataTypes.TEXT("medium"),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Body") && this.getDataValue("Body") !== null) throw new Error("Cannot set Insight Body after initialization");
			else this.setDataValue("Body", value);
		}
	},
	Image: {
		type: DataTypes.STRING(200),
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		},
		set(newImageUrl) {
			this.setDataValue("Image", newImageUrl);
		}
	},
	Topic: {
		type: DataTypes.ENUM({
			values: ["Business", "Banks", "Financial", "Market", "Politics"]
		}),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newTopic) {
			this.setDataValue("Topic", newTopic);
		}
	},
	Date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Date") && this.getDataValue("Date") !== null) throw new Error("Cannot set Insight Date after initialization");
			else this.setDataValue("Date", value);
		}
	},
	Views: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
		defaultValue: 0,
		validate: {
			isInt: true
		},
		set(value) {
			if (this.getDataValue("Views") !== null) throw new Error("Cannot set Insight Views after initialization");
			else this.setDataValue("Views", value);
		}
	},
	Tags: {
		type: DataTypes.STRING(300),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(newTags) {
			this.setDataValue("Tags", newTags);
		}
	},
	Author: {
		type: DataTypes.STRING(100),
		allowNull: false,
		defaultValue: "Ken Chase",
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Author") && this.getDataValue("Author") !== null) throw new Error("Cannot set Insight Author after initialization");
			else this.setDataValue("Author", value);
		}
	},
	Description: {
		type: DataTypes.TEXT("tiny"),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [20, 50]
		},
		set(value) {
			this.setDataValue("Description", value);
		}
	},
	Keywords: {
		type: DataTypes.TEXT("tiny"),
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [10, 50]
		},
		set(value) {
			this.setDataValue("Keywords", value);
		}
	}
}, {
	sequelize: connection,
	modelName: "Insight",
	tableName: "Insights",
	createdAt: false,
	updatedAt: false
});

module.exports = Insight;