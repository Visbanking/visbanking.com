const FAQ = require("../models/faq")
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const FAQController = {
	async createFAQ(questionData) {
		const question = new FAQ(questionData);
		try {
			const result = await question.save();
			return {
				message: "FAQ created successfully",
				question: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create FAQ",
				error: err.original
			};
		}
	},
	async updateFAQ(faqQuestion, updateOptions) {
		const question = await FAQ.findOne({
			where: {
				Question: questionQuestion
			}
		});
		try {
			if (question === null) throw new ResourceNotFoundError({
				resourceType: "FAQ",
				searchParameters: {
					Question: faqQuestion
				}
			});
			for (const property in updateOptions) question.setDataValue(property, updateOptions[property]);
			const result = await question.save();
			return {
				message: "FAQ updated successfully",
				question: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update FAQ",
					error: err
				};
			}
			return {
				message: "Faioled to update FAQ",
				error: err.original
			};
		}
	},
	async deleteFAQ(faqQuestion) {
		const question = await FAQ.findOne({
			where: {
				Question: faqQuestion
			}
		});
		try {
			if (question === null) throw new ResourceNotFoundError({
				resourceType: "FAQ",
				searchParameters: {
					Question: faqQuestion
				}
			});
			const result = await question.destroy();
			return {
				message: "FAQ deleted successfully",
				question: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete FAQ",
					error: err
				};
			}
			return {
				message: "Failed to delete FAQ",
				error: err.original
			};
		}
	}
};

module.exports = FAQController;