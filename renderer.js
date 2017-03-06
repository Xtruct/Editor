/* Required */
global.req  = require('app-root-path').require;
global.ROOT = require('app-root-path');

/* Global Editor */
/* TODO refactor in a class Editor */
global.project     = {};
global.projectPath = "";
global.plugins     = [];

const remote = require('electron').remote;

const core = req("core/Core.js");

/* TODO Put that in Editor global object to allow global.Editor.Console for example */
const Layout         = core.Layout;
const Preview        = core.Preview;
const Console        = core.Console;
const PluginLoader   = core.PluginLoader;
const Navbar         = core.Navbar;
const VersionManager = req('modules/versionManager.js');
const _Project       = req("core/Project.js");

let vm = new VersionManager();
vm.patchBuild();

let Project = new _Project();

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

$(window).on('load', () => {

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