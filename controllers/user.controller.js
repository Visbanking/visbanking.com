const User = require("../models/user.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

const UserController = {
	async createUser(userData) {
		const user = new User(userData);
		try {
			const result = await user.save();
			return {
				message: "User created successfully",
				user: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create User",
				error: err.original
			};
		}
	},
	async updateUser(userEmail, updateOptions) {
		const user = await User.findOne({
			where: {
				Email: userEmail
			}
		});
		try {
			if (user === null) throw new ResourceNotFoundError({
				resourceType: "User",
				searchParameters: {
					Email: userEmail
				}
			});
			for (const property in updateOptions) user.setDataValue(property, updateOptions[property]);
			const result = await user.save();
			return {
				message: "User updated successfully",
				user: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update User",
					error: err
				};
			}
			return {
				message: "Failed to update User",
				error: err.original
			};
		}
	},
	async deleteUser(userEmail) {
		const user = await User.findOne({
			where: {
				Email: userEmail
			}
		});
		try {
			if (user === null) throw new ResourceNotFoundError({
				resourceType: "User",
				searchParameters: {
					Email: userEmail
				}
			});
			const result = await user.destroy();
			return {
				message: "User deleted successfully",
				user: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete User",
					error: err
				};
			}
			return {
				message: "Failed to delete User",
				error: err.original
			};
		}
	}
};

module.exports = UserController;