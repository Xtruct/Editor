const fs   = require("fs");
const path = require("path");

module.exports = class ConfigurationLoader {
	constructor() {
	}

	load(file, parsed=true) {
		console.log(path.join(ROOT.toString(), "config", file + ".json"));
		let content = "";

		try {
			if (parsed)
				content = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config", file + ".json")));
			else
				content = fs.readFileSync(path.join(ROOT.toString(), "config", file + ".json"));
		}
		catch (e) {
			console.log("ConfigurationLoader error : ", e);
		}

		return content;
	}
};