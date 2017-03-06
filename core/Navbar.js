const fs        = require("fs");
const path      = require("path");
const _Project  = req("core/Project.js");
const dialog    = require('electron').remote.dialog;
const camelCase = require('camelcase');
const is        = require("is");

let Project = new _Project();

module.exports = class Navbar {
	constructor () {
		this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config/navbar.json"), 'utf8'));
	}

	init () {

		this.generateDropDowns();

		$("#newproject-item").on("click", () => {
			$('#newProjectModal').modal('open');
		});

		$("#open-item").on("click", () => {
			Project.loadAskPath();
		});

		$("#reopen-item").on("click", () => {
			Project.openLast();
		});

		$("#start-item").on("click", () => {
			Project.openExternal();
		});

		$("#modalValidateCustomProject").on('click', () => {
			let projectPath = Project.newProject();
			Project.load(projectPath);
		});

		$(".dropdown-button").dropdown();
	}

	generateDropDowns () {
		$.each(this.config, (key, values) => {
			console.log("key : ", key, "values", values);
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