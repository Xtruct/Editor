/**
 * Created by Armaldio on 21/03/2017.
 */

const fs       = require("fs");
const path     = require("path");
module.exports = class x {
	constructor () {

	}

	static require (file, instanciateClass = false, classData) {
		const ext = [
			".js",
			".json",
		];

		let p   = path.join(ROOT.toString(), file);
		let ret = false;

		p = p.split(".").join(path.sep);
		ext.forEach((elem) => {
			if (fs.existsSync(p + elem)) {
				ret = require(p);
				if (instanciateClass)
					ret = new ret(classData);
				return true;
			}
		});

		if (ret !== false)
			return (ret);
		console.warn(`File '${p}' not found`);
	}
};