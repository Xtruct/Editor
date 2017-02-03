const Layout      = require("./core/Core.js").Layout;
const Preview      = require("./core/Core.js").Preview;

const nprogress   = require("nprogress");


$(document).ready(function () {
	//nprogress.start();
	//nprogress.set(0.5);
	Layout.setup();

});


$(window).load(() => {
	$(".dropdown-button").dropdown();

	Preview.start();
});