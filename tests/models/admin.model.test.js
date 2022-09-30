const Admin = require("../../models/admin.model");

test("Creates new Admin object into 'admin' constant", () => {
	const admin = new Admin({
		Username: "test",
		Password: "test"
	});
	expect(admin).toHaveProperty("ID");
	expect(admin).toHaveProperty("Username", "test");
	expect(admin).toHaveProperty("Password");
});

test("New Admin object doesn't define Username property unless passed in", () => {
	const admin = new Admin({
		Password: "test"
	});
	expect(admin.Username).toBeUndefined();
	admin.Username = "test";
	expect(admin).toHaveProperty("Username", "test");
});

test("New Admin object defines default Password value", () => {
	const admin = new Admin({
		Username: "test"
	});
	expect(admin).toHaveProperty("Password");
});

test("New Admin object doesn't save plain text password", () => {
	const admin = new Admin({
		Username: "test",
		Password: "test"
	});
	expect(admin.Password).not.toBe("test");
});

test("New Admin object password is encrypted with SHA512 algorithm", () => {
	const admin = new Admin({
		Username: "test",
		Password: "test"
	});
	expect(admin.Password).toBe(require("hash.js").sha512().update("test").digest("hex"));
});

test("Admin.findAll() returns an array of Admin instances", () => {
	Admin.findAll()
	.then(results => {
		expect(results).toEqual([ ...results ]);
		results.forEach(result => {
			expect(result instanceof Admin).toBe(true);
		});
	});
});

test("Admin.findOne() returns an instance of Admin", () => {
	Admin.findOne()
	.then(result => {
		expect(result instanceof Admin).toBe(true);
	});
});