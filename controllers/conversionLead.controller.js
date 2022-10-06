const ConversionLead = require("../models/conversionLead.model");

class ConversionLeadController {
	static async #createLead(conversionLeadData) {
		const conversionLead = new ConversionLead(conversionLeadData);
		try {
			const result = await conversionLead.save();
			return {
				message: "Conversion Lead created successfully",
				conversionLead: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create Conversion Lead",
				error: err.original || err
			};
		}
	}
	static async createNewLead(conversionLeadData) {
		const result = await ConversionLeadController.#createLead(conversionLeadData);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllLeads() {
		return await ConversionLead.findAll();
	}
}

module.exports = ConversionLeadController;