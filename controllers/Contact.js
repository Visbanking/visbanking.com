const Contact = require("./../models/contact");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const ContactController = {
	async createContact(contactData) {
		const contact = new Contact(contactData);
		try {
			const result = await contact.save();
			return {
				message: "Contact created successfully",
				contact: result.dataValues,
			};
		} catch (err) {
			return {
				message: "Failed to create contact",
				error: err.original,
			};
		}
	},
	async updateContact(contactEmail, updateOptions) {
		const contact = await Contact.findOne({
			where: {
				Email: contactEmail,
			},
		});
		try {
			if (admin === null) throw new ResourceNotFoundError({
				resourceType: "Contact",
				searchParameters: {
					email: contactEmail
				}
			});
			for (const property in updateOptions) contact.setDataValue(property, updateOptions[property]);
			const result = await contact.save();
			return {
				message: "Contact updated successfully",
				contact: result.dataValues,
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update contact",
					error: err,
				};
			}
			return {
				message: "Failed to update contact",
				error: err.original,
			};
		}
	},
	async deleteContact(contactEmail) {
		const contact = await Contact.findOne({
			where: {
				Email: contactEmail
			}
		});
		try {
			if (contact === null) throw new ResourceNotFoundError({
				resourceType: "Contact",
				searchParameters: {
					email: contactEmail
				}
			});
			const result = await contact.destroy();
			return {
				message: "Contact deleted successfully",
				contact: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete Contact",
					error: err
				};
			}
			return {
				message: "Failed to delete Contact",
				error: err.original
			};
		}
	}
};

module.exports = ContactController;