module.exports = class Editor {
	constructor () {
		this.selector = "#navbar";
	}

	addMenu (title, id = "") {

		let obj = {};

		if (id === "")
			obj[title] = {};
		else
			obj[title] = id;

		return (obj);
	}

	setup()
	{

	}

	load()
	{

	}
};