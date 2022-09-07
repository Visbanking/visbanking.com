const Member = require("../models/member.model");
const ResourceNotFoundError = require("./../data/errors/ResourceNotFoundError");

const MemberController = {
	async createMember(memberData) {
		const member = new Member(memberData);
		try {
			const result = await member.save();
			return {
				message: "Team Member created successfully",
				member: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create Team Member",
				error: err.original
			};
		}
	},
	async updateMember(memberName, updateOptions) {
		const member = await Member.findOne({
			where: {
				Name: memberName
			}
		});
		try {
			if (member === null) throw new ResourceNotFoundError({
				resourceType: "Member",
				searchParameters: {
					Name: memberName
				}
			});
			for (const property in updateOptions) member.setDataValue(property, updateOptions[property]);
			const result = await member.save();
			return {
				message: "Team Member updated successfully",
				member: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to udpate Team Member",
					error: err
				};
			}
			return {
				message: "Failed to update Team Member",
				error: err.original
			};
		}
	},
	async deleteMember(memberName) {
		const member = await Member.findOne({
			where: {
				Name: memberName
			}
		});
		try {
			if (member === null) throw new ResourceNotFoundError({
				resourceType: "Member",
				searchParameters: {
					Name: memberName
				}
			});
			const result = await member.destroy();
			return {
				message: "Team Member deleted successfully",
				member: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete Team Member",
					error: err
				};
			}
			return {
				message: "Failed to delete Team Member",
				error: err.original
			};
		}
	}
};

module.exports = MemberController;