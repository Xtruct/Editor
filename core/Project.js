/**
 * Created by Armaldio on 06/02/2017.
 */

const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const _Console = req("core/Console.js");
let Console = new _Console();

const _ConfigurationLoader = req("core/ConfigurationLoader.js");
let ConfigurationLoader = new _ConfigurationLoader();

const dialog = require('electron').remote.dialog;
let window = require('electron').remote.getCurrentWindow();


module.exports = class Project {
	constructor() {
		this.projectPath = "";
	};

	newProject() {
		let self = this;

		dialog.showOpenDialog(window, {
			properties: ['openDirectory', 'createDirectory']
		}, (pathname) => {
			let p = pathname[0];
			self.projectPath = p;

			//Create project file
			fs.writeFileSync(path.join(p, "Project.xtruct"), ConfigurationLoader.load("defaultproject", false), 'utf8');
			Console.editor.say("Project file created");

			//Create assets folder
			mkdirp(path.join(p, "assets"), function (err) {
				if (err) console.error(err);
				else Console.editor.say('Assets created!')
			});

			//Create scenes folder
			mkdirp(path.join(p, "scenes"), function (err) {
				if (err) console.error(err);
				else Console.editor.say('Scenes created!')
			});

			//Create objects folder
			mkdirp(path.join(p, "objects"), function (err) {
				if (err) console.error(err);
				else Console.editor.say('Objects creted!')
			});

		});
	};

	load() {

	};
};