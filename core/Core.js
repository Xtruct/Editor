/**
 * Created by quent on 02/02/2017.
 */

let Layout = require("./layout");
let Settings = require("./Settings");
let Preview = require("./Preview/Preview");

module.exports = {
	Layout  : new Layout(),
	Settings: new Settings(),
	Preview: new Preview()
};