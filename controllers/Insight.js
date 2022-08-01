const Insight = require("./../models/insight");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const InsightController = {
	async createInsight(insightData) {
		const insight = new Insight(insightData);
		try {
			const result = await insight.save();
			return {
				message: "Insight created successfully",
				insight: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create insight",
				error: err.original
			};
		}
	},
	async updateInsight(insightTitle, updateOptions) {
		const insight = await Insight.findOne({
			where: {
				Title: insightTitle
			}
		});
		try {
			if (insight === null) throw new ResourceNotFoundError({
				resourceType: "Insight",
				searchParameters: {
					title: insightTitle
				}
			});
			for (const property in updateOptions) insight.setDataValue(property, updateOptions[property]);
			const result = await insight.save();
			return {
				message: "Insight updated successfully",
				insight: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update insight",
					error: err
				};
			}
			return {
				message: "Failed to update insight",
				error: err.original
			};
		}
	},
	async deleteInsight(insightTitle) {
		const insight = await Insight.findOne({
			where: {
				Title: insightTitle
			}
		});
		try {
			if (insight === null) throw new ResourceNotFoundError({
				resourceType: "Insight",
				searchParameters: {
					Title: insightTitle
				}
			});
			const result = await insight.destroy();
			return {
				message: "Insight deleted successfully",
				insight: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete insight",
					error: err
				};
			}
			return {
				message: "Failed to delete insight",
				error: err.original
			};
		}
	}
};

module.exports = InsightController;