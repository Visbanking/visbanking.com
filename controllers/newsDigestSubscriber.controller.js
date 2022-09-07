const NewsDigestSubscriber = require("../models/newsDigestSubscriber.model");
const ResourceNotFoundError = require("./../data/errors/ResourceNotFoundError");

const NewsDigestSubscriberController = {
	async createSubscriber(subscriberData) {
		const subscriber = new NewsDigestSubscriber(subscriberData);
		try {
			const result = await subscriber.save();
			return {
				message: "News Digest Subscriber created successfully",
				newsDigestSubscriber: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create News Digest Subscriber",
				error: err.original
			};
		}
	},
	async updateSubscriber(subscriberEmail, updateOptions) {
		const subscriber = await NewsDigestSubscriber.findOne({
			where: {
				Email: subscriberEmail
			}
		});
		try {
			if (subscriber === null) throw new ResourceNotFoundError({
				resourceType: "NewsDigestSubscriber",
				searchParameters: {
					Email: subscriberEmail
				}
			});
			for (const property in updateOptions) subscriber.setDataValue(property, updateOptions[property]);
			const result = await subscriber.save();
			return {
				message: "News Digest Subscriber updated successfully",
				newsDigestSubscriber: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update News Digest Subscriber",
					error: err
				};
			}
			return {
				message: "Failed to update News Digest Subscriber",
				error: err.original
			};
		}
	},
	async deleteSubscriber(subscriberEmail) {
		const subscriber = await NewsDigestSubscriber.findOne({
			where: {
				Email: subscriberEmail
			}
		});
		try {
			if (subscriber === null) throw new ResourceNotFoundError({
				resourceType: "NewsDigestSubscriber",
				searchParameters: {
					Email: subscriberEmail
				}
			});
			const result = await subscriber.destroy();
			return {
				message: "News Digest Subscriber deleted successfully",
				newsDigestSubscriber: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete News Digest Subscriber",
					error: err
				};
			}
			return {
				message: "Failed to delete News Digest Subscriber",
				error: err.original
			};
		}
	}
};

module.exports = NewsDigestSubscriberController;