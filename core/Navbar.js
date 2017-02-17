const fs       = require("fs");
const path     = require("path");
const _Project = req("core/Project.js");
const dialog   = require('electron').remote.dialog;

let Project = new _Project();

module.exports = class Navbar {
	constructor () {
		this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config/navbar.json"), 'utf8'));
	}

	init () {
		$("#navbar-new").on("click", () => {
			$('#newProjectModal').modal('open');
		});

		$("#navbar-open").on("click", () => {
			Project.loadAskPath();
		});

		$("#modalValidateCustomProject").on('click', () => {
			let projectPath = Project.newProject();
			Project.load(projectPath);
		});

	}
};