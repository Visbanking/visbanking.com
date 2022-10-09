const Service = require("../models/service.model");
const ResourceNotFoundError = require("../data/errors/ResourceNotFoundError");

class ServiceController {
	static async #createService(serviceData) {
		const service = new Service(serviceData);
		try {
			const result = await service.save();
			return {
				message: "Service created successfully",
				service: result.dataValues
			};
		} catch (err) {
			return {
				message: "Failed to create Service",
				error: err.original || err
			};
		};
	}
	static async #updateService(serviceName, updateOptions) {
		const service = await Service.findOne({
			where: {
				Name: serviceName
			}
		});
		try {
			if (service === null) throw new ResourceNotFoundError({
				resourceType: "Service",
				searchParameters: {
					name: serviceName
				}
			});
			for (const property in updateOptions) service.setDataValue(property, updateOptions[property]);
			const result = await service.save();
			return {
				message: "Service updated successfully",
				service: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to update Service",
					error: err
				};
			}
			return {
				message: "Failed to update Service",
				error: err.original
			};
		};
	}
	static async #deleteService(serviceName) {
		const service = await Service.findOne({
			where: {
				Name: serviceName
			}
		});
		try {
			if (service === null) throw new ResourceNotFoundError({
				resourceType: "Service",
				searchParameters: {
					name: serviceName
				}
			});
			const result = await service.destroy();
			return {
				message: "Service deleted successfully",
				service: result.dataValues
			};
		} catch (err) {
			if (err instanceof ResourceNotFoundError) {
				return {
					message: "Failed to delete Service",
					error: err
				};
			}
			return {
				message: "Failed to delete Service",
				error: err.original
			};
		};
	}
	static async createNewService(createOptions) {
		const result = await ServiceController.#createService(createOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async getAllServices() {
		return await Service.findAll();
	}
	static async getService(searchParameters) {
		return await Service.findOne({
			where: searchParameters
		});
	}
	static async getServiceById(serviceId) {
		return await ServiceController.getService({
			ID: serviceId
		});
	}
	static async getServiceByName(serviceName) {
		return await ServiceController.getService({
			Name: serviceName
		});
	}
	static async updateService(serviceName, updateOptions) {
		const result = await ServiceController.#updateService(serviceName, updateOptions);
		if (result.error) throw result.error;
		else return result;
	}
	static async deleteService(serviceName) {
		const result = await ServiceController.#deleteService(serviceName);
		if (result.error) throw result.error;
		else return result;
	}
};

module.exports = ServiceController;