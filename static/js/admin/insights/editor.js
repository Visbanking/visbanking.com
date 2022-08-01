const editor = new EditorJS({
	holder: "article",
	tools: {
		header: {
			class: Header,
			shortcut: "CMD+SHIFT+H",
			config: {
				placeholder: "Add a header",
				levels: [2, 3],
				defaultLevel: 2
			},
			inlineToolbar: true
		},
		list: {
			class: List,
			shortcut: "CMD+SHIFT+L",
			inlineToolbar: true
		},
		urlImage: SimpleImage,
		underline: Underline,
		marker: {
			class: Marker,
			shortcut: "CMD+SHIFT+M"
		},
		paragraph: {
			class: Paragraph,
			inlineToolbar: true
		}
	},
	onChange: (api, event) => {
		editor.save().then(setMarkdownBody);
	}
});

const setTitle = (text) => {
	document.querySelector("input#title").value = text;
};

const createMarkdownHeader = (data) => {
	if (data.level === 1)
		return setTitle(data.text);
	return `${"#".repeat(data.level)} ${data.text}`;
};

const createMarkdownParagraph = (data) => {
	return data.text;
};

const createMarkdownUnorderedList = (items) => {
	items = items.map(item =>  `- ${item}`);
	return items.join("\n");
};

const createMarkdownOrderedList = (items) => {
	items = items.map(item =>  `1. ${item}`);
	return items.join("\n");
};

const createMarkdownList = (data) => {
	if (data.style === "unordered") return createMarkdownUnorderedList(data.items);
	else if (data.style === "ordered") return createMarkdownOrderedList(data.items);
};

const createMarkdownImage = (data) => {
	return `![${data.caption}](${data.url} "${data.caption}")`;
};

const createMarkdownBody = (data) => {
	const body = [];
	data.blocks.forEach(block => {
		if (block.type === "header") body.push(createMarkdownHeader(block.data));
		else if (block.type === "paragraph") body.push(createMarkdownParagraph(block.data));
		else if (block.type === "list") body.push(createMarkdownList(block.data));
		else if (block.type === "urlImage") body.push(createMarkdownImage(block.data));
	});
	return body.join("\n\n");
};

const setMarkdownBody = (data) => {
	document.querySelector("#text textarea#body").value = createMarkdownBody(data);
};