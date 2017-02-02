let $ = window.$ = require("jquery");
let Layout = require("./xtraengine/xtraengine.js").Layout;
let nprogress = require("nprogress");

$(function() {
	nprogress.start();
	nprogress.set(0.5);
	Layout.setup();
	Layout.saveLayout();
});