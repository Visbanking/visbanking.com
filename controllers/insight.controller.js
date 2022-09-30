const Insight = require("../models/insight.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

class InsightController {
	static async #createInsight(insightData) {
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
				error: err.original || err
			};
		}
	}
	static async #updateInsight(insightTitle, updateOptions) {
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
	}
	static async #deleteInsight(insightTitle=null) {
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
	static async createNewInsight(createOptions) {
		const result = await InsightController.#createInsight(createOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllInsights(projection=null) {
		return await Insight.findAll(projection ? {
			attributes: projection.split(" ")
		} : {});
	}
	static async getInsight(searchParameters, projection=null) {
		const findOptions = {};
		if (projection) findOptions.attributes=projection.split(" ");
		findOptions.where = searchParameters;
		return await Insight.findOne(findOptions);
	}
	static async getInsightById(insightId, projection=null) {
		return await InsightController.getInsight({
			ID: insightId
		}, projection);
	}
	static async getInsightsByPage(page=0, limit=15) {
		return await Insight.findAll({
			limit,
			offset: page*limit
		});
	}
	static async updateInsightById(insightId, updateOptions) {
		const insight = await InsightController.getInsightById(insightId, "Title");
		const result = await InsightController.#updateInsight(insight?.Title || null, updateOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async deleteInsightById(insightId) {
		const insight = await InsightController.getInsightById(insightId, "Title");
		const result = await InsightController.#deleteInsight(insight?.Title);
		if (result.error) throw result.error;
		else return result;
	}
};

module.exports = InsightController;