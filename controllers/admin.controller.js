const Admin = require("../models/admin.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

class AdminController {
	static async #createAdmin(username) {
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
	}
	static async #updateAdmin(adminUsername, updateOptions) {
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
	}
	static async #deleteAdmin(adminUsername) {
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
	static async createNewAdmin(createOptions) {
		const result = await AdminController.#createAdmin(createOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllAdmins(projection=null) {
		return await Admin.findAll(projection ? {
			attributes: projection.split(" ")
		} : {});
	}
	static async getAdmin(searchParameters, projection=null) {
		const findOptions = {};
		if (projection) findOptions.attributes=projection.split(" ");
		findOptions.where = searchParameters;
		return await Admin.findOne(findOptions);
	}
	static async getAdminById(adminId, projection=null) {
		return await AdminController.getInsight({
			ID: adminId
		}, projection);
	}
	static async updateAdminById(adminId, updateOptions) {
		const admin = await AdminController.getAdminById(adminId, "Username");
		const result = await AdminController.#updateAdmin(admin?.username, updateOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async deleteAdminById(adminId) {
		const admin = await AdminController.getAdminById(adminId, "Username");
		const result = await AdminController.#deleteAdmin(admin?.Username);
		if (result.error) throw result.error;
		else return result;
	}
};

module.exports = AdminController;