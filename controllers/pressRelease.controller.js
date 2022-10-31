const PressRelease = require("../models/pressRelease.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

class PressReleaseController {
	static async #createPressRelease(insightData) {
		const pressRelease = new PressRelease(insightData);
		try {
			const result = await pressRelease.save();
			return {
				message: "PressRelease created successfully",
				pressRelease: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create pressRelease",
				error: err.original || err
			};
		}
	}
	static async #updatePressRelease(insightTitle, updateOptions) {
		const pressRelease = await PressRelease.findOne({
			where: {
				Title: insightTitle
			}
		});
		try {
			if (pressRelease === null) throw new ResourceNotFoundError({
				resourceType: "PressRelease",
				searchParameters: {
					title: insightTitle
				}
			});
			for (const property in updateOptions) pressRelease.setDataValue(property, updateOptions[property]);
			const result = await pressRelease.save();
			return {
				message: "Press Release updated successfully",
				pressRelease: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update Press Release",
					error: err
				};
			}
			return {
				message: "Failed to update Press Release",
				error: err.original
			};
		}
	}
	static async #deletePressRelease(insightTitle=null) {
		const pressRelease = await PressRelease.findOne({
			where: {
				Title: insightTitle
			}
		});
		try {
			if (pressRelease === null) throw new ResourceNotFoundError({
				resourceType: "PressRelease",
				searchParameters: {
					Title: insightTitle
				}
			});
			const result = await pressRelease.destroy();
			return {
				message: "Press Release deleted successfully",
				pressRelease: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete Press Release",
					error: err
				};
			}
			return {
				message: "Failed to delete Press Release",
				error: err.original
			};
		}
	}
	static async createNewPressRelease(createOptions) {
		const result = await PressReleaseController.#createPressRelease(createOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllPressReleases(projection=null) {
		return await PressRelease.findAll({
			attributes: projection ? projection.split(" ") : null,
			order: [
				["Date", "DESC"]
			]
		});
	}
	static async getPressRelease(searchParameters, projection=null) {
		const findOptions = {};
		if (projection) findOptions.attributes=projection.split(" ");
		findOptions.where = searchParameters;
		return await PressRelease.findOne(findOptions);
	}
	static async getPressReleaseById(insightId, projection=null) {
		return await PressReleaseController.getPressRelease({
			ID: insightId
		}, projection);
	}
	// static async getPressReleasesByPage(page=0, limit=15) {
	// 	return await PressRelease.findAll({
	// 		limit,
	// 		offset: page*limit,
	// 		order: [
	// 			["Date", "DESC"]
	// 		]
	// 	});
	// }
	// static async getPressReleasesByTopicAndPage(topic="", page=0, limit=15) {
	// 	if (!topic) throw new Error("Missing required parameter 'topic'");
	// 	return await PressRelease.findAll({
	// 		where:{
	// 			Topic: topic || ""
	// 		},
	// 		limit,
	// 		offset: page*limit,
	// 		order: [
	// 			["Date", "DESC"]
	// 		]
	// 	});
	// }
	static async updatePressReleaseById(insightId, updateOptions) {
		const pressRelease = await PressReleaseController.getPressReleaseById(insightId, "Title");
		const result = await PressReleaseController.#updatePressRelease(pressRelease?.Title || null, updateOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async deletePressReleaseById(insightId) {
		const pressRelease = await PressReleaseController.getPressReleaseById(insightId, "Title");
		const result = await PressReleaseController.#deletePressRelease(pressRelease?.Title);
		if (result.error) throw result.error;
		else return result;
	}
};

module.exports = PressReleaseController;