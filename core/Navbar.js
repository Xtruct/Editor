const fs        = require("fs");
const path      = require("path");
const dialog    = require('electron').remote.dialog;
const camelCase = require('camelcase');
const is        = require("is");

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
			$('#newProjectModal').modal('open');
		});

		this.addCallback("open", "click", () => {
			Project.loadAskPath();
		});

		this.addCallback("reopen", "click", () => {
			Project.openLast();
		});

		this.addCallback("start", "click", () => {
			Project.openExternal();
		});

		/* Other */
		$("#modalValidateCustomProject").on('click', () => {
			let projectPath = Project.newProject();
			Project.load(projectPath);
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