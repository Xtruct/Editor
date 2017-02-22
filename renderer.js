global.req         = require('app-root-path').require;
global.ROOT        = require('app-root-path');
global.project     = {};
global.projectPath = "";
global.plugins     = [];

const remote = require('electron').remote;

const core = req("core/Core.js");

const Layout         = core.Layout;
const Preview        = core.Preview;
const Console        = core.Console;
const PluginLoader   = core.PluginLoader;
const Navbar         = core.Navbar;
const VersionManager = req('modules/versionManager.js');

let vm = new VersionManager();
vm.patchBuild();

const nprogress = require("nprogress");

$(document).ready(() => {
	nprogress.start();
	Layout.setup();
	Console.editor.say("Layout setup");

	Navbar.init();
	PluginLoader.loadPlugins();
	nprogress.done();
	Console.editor.say("IDE ready", "#4CAF50");
});

$("#FABaddNewObject").on("click", () => {
	$("#chooseObjectModal").modal("open");
});

$("#FABaddNewScene").on("click", () => {
	if (global.project) {

	}
});

$(window).on('load', () => {

	$(".dropdown-button").dropdown();
	$('.modal').modal({
		dismissible: false,
		opacity    : .5,
		inDuration : 300,
		outDuration: 200,
		startingTop: '50%',
		endingTop  : '25%',
		ready      : function (modal, trigger) {
		},
		complete   : function () {

		}
	});

	//------------------------------------------------------------------------------------------------------------------

	$("#xtruct-version").text("Xtruct " + vm.toString());

	//------------------------------------------------------------------------------------------------------------------

	//Preview.start();
});