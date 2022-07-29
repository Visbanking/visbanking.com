module.exports = class ResourceNotFoundError extends Error {
	constructor(options) {
		super(options.message);
		this.name = "ResourceNotFoundError";
		this.resourceType = options.resourceType;
		this.searchParameters = options.searchParameters;
	}
};
