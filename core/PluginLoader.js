/**
 * Created by Armaldio on 06/02/2017.
 */

let fs = require('fs');

module.exports = class PluginLoader {
	constructor () {
		//this.path = path;
	}

	loadPlugins () {
		let plugins = require('require-all')({
			dirname: ROOT.toString() + "/plugins", //filter : /(.+Controller)\.js$/,
			resolve: function (Plugin) {
				let c = new Plugin();
				global.plugins.push(c);
				try {
					c.load();
				} catch (e) {

				}
			}
		});
		console.log(global.plugins);
	}
};