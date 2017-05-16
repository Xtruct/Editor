const fs = require("fs");
const path = require("path");
const dialog = require('electron').remote.dialog;
const camelCase = require('camelcase');
const is = require("is");

const Console = x.require("core.Console");

module.exports = class Navbar {
    constructor() {
        this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config/navbar.json"), 'utf8'));
    }

    /**
     * Initialize navbar and trigger events
     */
    init() {

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

        $('.ui.dropdown').dropdown();
    }

    /**
     * Generate callbacks for navbar elements
     * @param elem
     * @param event
     * @param callback
     */
    addCallback(elem, event, callback) {
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
    generateDropDowns() {
        $.each(this.config, (key, values) => {

            let navbar = $("#navbar");
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