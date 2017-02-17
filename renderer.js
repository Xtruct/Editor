// @flow

global.req  = require('app-root-path').require;
global.ROOT = require('app-root-path');

const Layout  = req("core/Core.js").Layout;
const Preview = req("core/Core.js").Preview;
const Console = req("core/Core.js").Console;

const _Navbar = req("core/Navbar.js");
let Navbar    = new _Navbar();

const nprogress = require("nprogress");

$(document).on("mousedown", function (ev) {
	if (ev.which == 2) {
		ev.preventDefault();
		return false;
	}
});

$(document).ready(() => {
	//nprogress.start();
	//nprogress.set(0.5);
	Layout.setup();
	Console.editor.say("Layout setup");

	Navbar.init();
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

	Preview.start();
	Console.editor.say("IDE ready", "#4CAF50");
});