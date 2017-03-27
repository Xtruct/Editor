/**
 * Created by Armaldio on 17/02/2017.
 */
const fs   = require("fs");
const path = require("path");

module.exports = class VersionManager {
	constructor (file = "version.json") {
		this.file   = file;
		this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), file), 'utf8'));
	}

	patchBuild () {
		this.config.build++;
		fs.writeFileSync(path.join(ROOT.toString(), this.file), JSON.stringify(this.config), 'utf8');
	}

	patchMajor () {
		this.config.major++;
		this.config.minor = 0;
		this.config.patch = 0;
		fs.writeFileSync(path.join(ROOT.toString(), this.file), JSON.stringify(this.config), 'utf8');
	}

	patchMinor () {
		this.config.minor++;
		this.config.patch = 0;
		fs.writeFileSync(path.join(ROOT.toString(), this.file), JSON.stringify(this.config), 'utf8');
	}

	patchPatch () {
		this.config.patch++;
		this.config.build = 1;
		fs.writeFileSync(path.join(ROOT.toString(), this.file), JSON.stringify(this.config), 'utf8');
	}

	setName () {
		this.config.build++;
		fs.writeFileSync(path.join(ROOT.toString(), this.file), JSON.stringify(this.config), 'utf8');
	}

	toString () {
		return ` ${this.config.name} ${this.config.major}.${this.config.minor}.${this.config.patch} build ${this.config.build}`;
	}

	getSemVer() {
		return `${this.config.major}.${this.config.minor}.${this.config.patch}`;
	}
};