const Layout      = require("./core/Core.js").Layout;
const Preview      = require("./core/Core.js").Preview;
const Console      = require("./core/Core.js").Console;

const nprogress   = require("nprogress");

//TODO add game console
//TODO rename console to editor console

//catch all errors
window.onerror = function(message, url, lineNumber) {
	Console.say(`${message}<br>__________  (${url}) - Line ${lineNumber}`, "#F44336");
	console.error(`${message}<br>__________  (${url}) - Line ${lineNumber}`);
	return true;
};

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

	//throw new Error("Lol");
});