const NewsletterSubscriber = require("../models/newsletterSubscriber.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const NewsletterSubscriberController = {
	async createSubscriber(subscriberData) {
		const subscriber = new NewsletterSubscriber(subscriberData);
		try {
			const result = await subscriber.save();
			return {
				message: "Newsletter subscriber created successfully",
				newsletterSubscriber: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create subscriber",
				error: err.original
			};
		}
	},
	async updateSubscriber(subscriberEmail, updateOptions) {
		const subscriber = await NewsletterSubscriber.findOne({
			where: {
				Email: subscriberEmail
			}
		});
		try {
			if (subscriber === null) throw new ResourceNotFoundError({
				resourceType: "NewsletterSubscriber",
				searchParameters: {
					email: subscriberEmail
				}
			});
			for (const property in updateOptions) subscriber.setDataValue(property, updateOptions[property]);
			const result = await subscriber.save();
			return {
				message: "Newsletter subscriber updated successfully",
				newsletterSubscriber: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update newsletter subscriber",
					error: err
				};
			}
			return {
				message:" Failed to update newsletter subscriber",
				error: err.original
			};
		}
	},
	async deleteSubscriber(subscriberEmail) {
		const subscriber = await NewsletterSubscriber.findOne({
			where: {
				Email: subscriberEmail
			}
		});
		try {
			if (subscriber === null) throw new ResourceNotFoundError({
				resourceType: "NewsletterSubscriber",
				searchParameters: {
					email: subscriberEmail
				}
			});
			const result = await subscriber.destroy();
			return {
				message: "Newsletter subscriber deleted successfully",
				newsletterSubscriber: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete newsletter subscriber",
					error: err
				};
			}
			return {
				message: "Failed to delete newsletter subscriber",
				error: err.original
			};
		}
	}
};

module.exports = NewsletterSubscriberController;