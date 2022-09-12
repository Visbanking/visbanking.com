const Contact = require("./../../models/contact.model");

test("Creates new Contact object into 'contact' constant", () => {
	const contact = new Contact({
		Name: "test",
		Email: "test@gmail.com",
		Message: "Test message"
	});
	expect(contact).toHaveProperty("ID");
	expect(contact).toHaveProperty("Name", "test");
	expect(contact).toHaveProperty("Email", "test@gmail.com");
	expect(contact).toHaveProperty("Message", "Test message");
	expect(contact).toHaveProperty("Topic");
});

test("New Contact object 'Topic' property defaults to 'General'", () => {
	const contact = new Contact({
		Name: "test",
		Email: "test@gmail.com",
		Message: "Test message"
	});
	expect(contact).toHaveProperty("Topic", "General");
});

test("New Contact object doesn't define a 'Phone' property unless passed in", () => {
	const contact = new Contact({
		Name: "test",
		Email: "test@gmail.com",
		Message: "Test message"
	});
	expect(contact.Phone).toBeUndefined();
	contact.Phone = "3103324949";
	expect(contact).toHaveProperty("Phone", "3103324949");
});

test("Contact object fails to save when Email property value is not email string", () => {
	const contact = new Contact({
		Name: "test",
		Email: "test.com",
		Message: "Test message"
	});
	contact.save()
	.catch(err => {
		expect(err).toHaveProperty("name", "SequelizeValidationError");
		expect(err).toHaveProperty("message", "Validation error: Validation isEmail on Email failed");
	});
});