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
			if (this.getDataValue("ID") !== null) throw new Error("Cannot set Insight ID after initialization");
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
			if (this.getDataValue("Title") !== null) throw new Error("Cannot set Insight Title after initialization");
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
			if (this.getDataValue("Body") !== null) throw new Error("Cannot set Insight Body after initialization");
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
		set(value) {
			if (this.getDataValue("Image") !== null) throw new Error("Cannot set Insight Image after initialization");
			else this.setDataValue("Image", value);
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
			if (this.getDataValue("Date") !== null) throw new Error("Cannot set Insight Date after initialization");
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
			if (typeof newTags === "string") newTags = newTags.split(",").map(tag => tag.trim());
			const tags = this.getDataValue("Tags").split(",").map(tag => tag.trim());
			this.setDataValue("Tags", tags.push(...newTags).join(", "));
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
			if (this.getDataValue("Author") !== null) throw new Error("Cannot set Insight Author after initialization");
			else this.setDataValue("Author", value);
		}
	},
	Description: {
		type: DataTypes.TEXT("tiny"),
		allowNull: false,
		validate: {
			notEmpty: true
		},
		set(value) {
			if (this.getDataValue("Description") !== null) throw new Error("Cannot set Insight Description after initialization");
			else this.setDataValue("Description", value);
		}
	},
	Keywords: {
		type: DataTypes.TEXT("tiny"),
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		set(value) {
			if (this.getDataValue("Keywords") !== null) throw new Error("Cannot set Insight Keywords after initialization");
			else this.setDataValue("Keywords", value);
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