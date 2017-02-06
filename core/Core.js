/**
 * Created by Armaldio on 02/02/2017.
 */

let Layout = require("./Layout.js");
let Settings = require("./Settings.js");
let Preview = require("./Preview/Preview.js");
let Console = require("./Console.js");

module.exports = {
	Layout  : new Layout(),
	Settings: new Settings(),
	Preview: new Preview(),
	Console: new Console()
};