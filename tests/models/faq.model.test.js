const FAQ = require("../../models/faq.model");

test("Creates new FAQ object into 'faq' constant", () => {
	const faq = new FAQ({
		Question: "Test Question",
		Answer: "Test Answer",
		Category: "Product"
	});
	expect(faq instanceof FAQ).toBe(true);
	expect(faq).toHaveProperty("ID");
	expect(faq).toHaveProperty("Question", "Test Question");
	expect(faq).toHaveProperty("Answer", "Test Answer");
	expect(faq).toHaveProperty("Category", "Product");
});

test("New FAQ object doesn't define Question property unless passed in", () => {
	const faq = new FAQ({
		Answer: "Test Answer",
		Category: "Product"
	});
	expect(faq.Question).toBeUndefined();
	faq.Question = "Test Question";
	expect(faq).toHaveProperty("Question", "Test Question");
});

test("New FAQ object doesn't define Answer property unless passed in", () => {
	const faq = new FAQ({
		Question: "Test Question",
		Category: "Product"
	});
	expect(faq.Answer).toBeUndefined();
	faq.Answer = "Test Answer";
	expect(faq).toHaveProperty("Answer", "Test Answer");
});

test("New FAQ object doesn't define Category property unless passed in", () => {
	const faq = new FAQ({
		Answer: "Test Answer",
		Question: "Test Question"
	});
	expect(faq.Category).toBeUndefined();
	faq.Category = "Product";
	expect(faq).toHaveProperty("Category", "Product");
});

test("FAQ instance only accepts pre-defined values for Category property", () => {
	const faq = new FAQ({
		Question: "Test Question",
		Answer: "Test Answer"
	});
	["Product", "Services", "Payment", "Account", "Support"].forEach(category => {
		expect(() => faq.Category = category).not.toThrow(Error);
	});
	expect(() => faq.Category = "test").toThrow(Error);
});

test("FAQ object fails to save when Question property is not defined", () => {
	const faq = new FAQ({
		Answer: "Test Answer",
		Category: "Product"
	});
	faq.save()
	.catch(err => {
		expect(err).toHaveProperty("name", "SequelizeValidationError");
		expect(err.message).toMatch(/(notNull Violation|Question)/ig);
	});
});

test("FAQ object fails to save when Answer property is not defined", () => {
	const faq = new FAQ({
		Question: "Test Question",
		Category: "Product"
	});
	faq.save()
	.catch(err => {
		expect(err).toHaveProperty("name", "SequelizeValidationError");
		expect(err.message).toMatch(/(notNull Violation|Answer)/ig);
	});
});

test("FAQ object fails to save when Category property is not defined", () => {
	const faq = new FAQ({
		Answer: "Test Answer",
		Question: "Test Question"
	});
	faq.save()
	.catch(err => {
		expect(err).toHaveProperty("name", "SequelizeValidationError");
		expect(err.message).toMatch(/(notNull Violation|Category)/ig);
	});
});

test("FAQ.findAll() returns an array of FAQ instances", () => {
	FAQ.findAll()
	.then(results => {
		expect(results).toEqual([ ...results ]);
		results.forEach(result => {
			expect(result instanceof FAQ).toBe(true);
		});
	});
});

test("FAQ.findOne() return an instance of FAQ", () => {
	FAQ.findOne()
	.then(result => {
		expect(result instanceof FAQ).toBe(true);
	});
});