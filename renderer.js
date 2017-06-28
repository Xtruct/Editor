/* Required */

// @flow

global.ROOT     = require('app-root-path');
global.x        = require("./core/x.js");
const remote    = require('electron').remote;
const unhandled = require('electron-unhandled');
const chokidar  = require('chokidar');
const isDev     = require("electron-is-dev");

global.Editor  = x.require("core.Editor");
global.Project = x.require("core.Project", true);

global.Editor.project     = {};
global.Editor.projectPath = "";
global.Editor.plugins     = [];

let Layout         = x.require("core.Layout", true);
let Preview        = x.require("core.Preview", true);
let Console        = x.require("core.Console");
let PluginLoader   = x.require("core.PluginLoader", true);
let Navbar         = x.require("core.Navbar", true);
let VersionManager = x.require('core.VersionManager', true);

const Modal = x.require("core.Modal", false);

VersionManager.patchBuild();

const nprogress = require("nprogress");

//catch any unhandled error
unhandled();

function liveCSS () {
	let styles = document.querySelectorAll('link[rel=stylesheet]');
	for (let i = 0; i < styles.length; i++) {
		let restyled = styles[i].getAttribute('href') + '?v=' + Math.random(0, 10000);
		styles[i].setAttribute('href', restyled);
	}
}

if (isDev) {
	var watcher = chokidar.watch(['./style/**/*.css',
								  './semantic/dist/semantic.min.css'], {
		persistent: true
	});

	watcher
		.on('add', path => liveCSS())
		.on('change', path => liveCSS())
		.on('unlink', path => liveCSS());
}

$(document).ready(() => {
	nprogress.start();

	/* UNCOMMENT TO TEST
	 let modal1 = new Modal({
	 title  : "Title",
	 message: "Message",
	 buttons: [
	 {
	 name : "Cancel",
	 id   : "cancel",
	 color: "red",
	 func : () => {
	 console.log("Cancelled");
	 }
	 },
	 {
	 name : "Ok",
	 id   : "ok",
	 color: "#ff0000",
	 func : () => {
	 console.log("OK");
	 }
	 },
	 ]
	 });

	 modal1.show();
	 */

	Layout.setup();
	Console.say("Layout loaded");

	Navbar.init();
	Console.say("Navar loaded");

	PluginLoader.loadPlugins();
	Console.say("Plugins loaded")

	Console.say("IDE ready", "#4CAF50");
	nprogress.done();
});

$(window).on('load', () => {

	$('.modal').modal({
		dismissible: false,
		opacity    : .5,
		inDuration : 300,
		outDuration: 200,
		startingTop: '24%',
		endingTop  : '26%',
		ready      : function (modal, trigger) {
			global.ModalInUse = true;
		},
		complete   : function () {
			global.ModalInUse = false;
		}
	});

	$("#xtruct-version").text("Xtruct " + VersionManager.toString());
});