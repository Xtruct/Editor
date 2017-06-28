const fs              = require("fs");
const path            = require("path");
const dialog          = require('electron').remote.dialog;
const remote          = require('electron').remote;
const camelCase       = require('camelcase');
const is              = require("is");
const openAboutWindow = remote.require('about-window').default;

const Console = x.require("core.Console");

module.exports = class Navbar {
	constructor () {
		this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config/navbar.json"), 'utf8'));
	}

	/**
	 * Initialize navbar and trigger events
	 */
	init () {

		/* Navbar dropdown */
		this.generateDropDowns();
		this.addCallback("newproject", "click", () => {
			//TODO need to fix the stepper
			//$('#newProjectModal').modal('open');

			global.Project.newProject();
		});

		this.addCallback("open", "click", () => {
			global.Project.loadAskPath();
		});

		this.addCallback("save", "click", () => {

			let json = global.Editor.canvas.toJSON();

			/**
			 * Set each image src to a relative path
			 */
			$.each(json.objects, (index, value) => {
				if (value.type === 'image') {
					let src = value.src.replace("file:///", "");
					src = path.relative(global.Editor.projectPath, src);
					console.log(global.Editor.projectPath);
					console.log(src);
					json.objects[index].src = src;
				}
			});

			//-------------------

			json      = JSON.stringify(json, null, '\t');
			let scene = global.Editor.currentScene;
			fs.writeFileSync(path.join(global.Editor.projectPath, "scenes", `${scene}.xscn`), json, "utf8");
			console.log("Saved to ", path.join(global.Editor.projectPath, "scenes", `${scene}.xscn`));
		});

		this.addCallback("reopen", "click", () => {
			global.Project.openLast();
		});

		this.addCallback("start", "click", () => {
			global.Project.openExternal();
		});

		this.addCallback("quickexport", "click", () => {
			global.Project.export();
		});

		this.addCallback("about", "click", () => {
			let year = new Date().getFullYear();

			//TODO make our own about window
			openAboutWindow({
				icon_path       : path.join(ROOT.toString(), 'logos/about.png'),
				copyright       : `Copyright (c) 2017-${year} Armaldio`,
				package_json_dir: path.join(ROOT.toString(), 'package.json'),
				homepage        : "https://github.com/Xtruct/Editor",
				bug_report_url  : "https://github.com/Xtruct/Editor/issues",
				win_options     : {
					icon     : path.join(ROOT.toString(), 'build/icon.ico'),
					width    : 550,
					resizable: false
				},
				description     : "The hackable 2D Game Editor",
				css_path        : path.join(ROOT.toString(), 'style/About.css'),
				open_devtools   : true
			});
		});

		/* Other */
		$("#modalValidateCustomProject").on('click', () => {
			let projectPath = global.Project.newProject();
			global.Project.load(projectPath);
		});

		$('.ui.dropdown').dropdown(
			{
				action: 'hide'
			}
		);
	}

	/**
	 * Generate callbacks for navbar elements
	 * @param elem
	 * @param event
	 * @param callback
	 */
	addCallback (elem, event, callback) {
		if (typeof callback === "function") {
			$(`#${elem}-item`).on(event, callback);
		}
		else {
			console.error("Callback is not a function");
		}
	}

	/**
	 * Generate HTML navabar
	 */
	generateDropDowns () {
		let navbar = $("#navbar");
		$.each(this.config, (key, values) => {

			let li;
			if (!is.object(values)) {
				li = `<div class="item" id="${values}-item">${key}</div>`;
			}
			else {
				li = `<div class="ui dropdown link item">
					  	<span class="text">${key}</span>
					  	<i class="dropdown icon"></i>
					  	<div class="menu">`;

				$.each(values, (k, v) => {
					li += `<div class="item" id="${v}-item" >${k}</div>`
				});

				li += `</div>`;
			}

			navbar.append(li);
		});
	}
};