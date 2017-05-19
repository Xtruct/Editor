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

		this.addCallback("reopen", "click", () => {
			global.Project.openLast();
		});

		this.addCallback("start", "click", () => {
			global.Project.openExternal();
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

		$(".dropdown-button").dropdown({
			constrainWidth: false
		});
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
		$.each(this.config, (key, values) => {

			let navbar = $("#navbar");
			let li;
			if (!is.object(values)) {
				li = `<li><a id="${values}-item">${key}</a></li>`;
			}
			else {
				li = `<li><a class="dropdown-button" data-beloworigin="true" data-activates="${camelCase(key)}-dropdown">${key}<i
                    class="material-icons right">arrow_drop_down</i></a></li>`;

				let dd = `<ul id="${camelCase(key)}-dropdown" class="dropdown-content">`;

				$.each(values, (k, v) => {
					dd += `<li><a id="${v}-item" >${k}</a></li>`
				});

				dd += `</ul>`;

				$("#navbardropdowns").append(dd);
			}

			navbar.append(li);
		});
	}
};