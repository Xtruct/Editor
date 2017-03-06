let Layout       = require("./Layout.js");
let Settings     = require("./Settings.js");
let Preview      = require("./Preview.js");
let Console      = require("./Console.js");
let PluginLoader = require("./PluginLoader.js");
let Navbar       = require("./Navbar.js");

module.exports = {
	Layout      : new Layout(),
	Settings    : new Settings(),
	Preview     : new Preview(),
	Console     : new Console(),
	Navbar      : new Navbar(),
	PluginLoader: new PluginLoader()
};