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