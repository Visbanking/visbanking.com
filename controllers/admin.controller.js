const Admin = require("../models/admin.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const AdminController = {
	async createAdmin(username) {
		const admin = new Admin({
			Username: username,
		});
		try {
			const result = await admin.save();
			return {
				message: "Admin created successfully",
				admin: result.dataValues,
			};
		} catch (err) {
			return {
				message: "Failed to create admin",
				error: err.original,
			};
		}
	},
	async updateAdmin(adminUsername, updateOptions) {
		const admin = await Admin.findOne({
			where: {
				Username: adminUsername,
			},
		});
		try {
			if (admin === null) throw new ResourceNotFoundError({
				resourceType: "Admin",
				searchParameters: {
					username: adminUsername
				}
			});
			for (const property in updateOptions) admin.setDataValue(property, updateOptions[property]);
			const result = await admin.save();
			return {
				message: "Admin updated successfully",
				admin: result.dataValues,
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update admin",
					error: err
				};
			}
			return {
				message: "Failed to update admin",
				error: err.original
			};
		}
	},
	async deleteAdmin(adminUsername) {
		const admin = await Admin.findOne({
			where: {
				Username: adminUsername
			}
		});
		try {
			if (admin === null) throw new ResourceNotFoundError({
				resourceType: "Admin",
				searchParameters: {
					username: adminUsername
				}
			});
			const result = await admin.destroy();
			return {
				message: "Admin deleted successfully",
				admin: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete admin",
					error: err
				};
			}
			return {
				message: "Faield to delete admin",
				error: err.original
			};
		}
	}
};

module.exports = AdminController;