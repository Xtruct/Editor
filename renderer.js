const Layout      = require("./core/Core.js").Layout;
const Preview      = require("./core/Core.js").Preview;
const Console      = require("./core/Core.js").Console;

const nprogress   = require("nprogress");


$(document).ready(function () {
	//nprogress.start();
	//nprogress.set(0.5);
	Layout.setup();
	Console.say("Layout setup");
});


$(window).load(() => {
	$(".dropdown-button").dropdown();

	Preview.start();
	Console.say("IDE ready", "#4CAF50");
});