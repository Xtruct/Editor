module.exports = class PluginLoader {
	constructor () {
		//this.path = path;
	}

	loadPlugins () {
		let count = 0;
		let plugins = require('require-all')({
			dirname: ROOT.toString() + "/plugins", //filter : /(.+Controller)\.js$/,
			resolve: function (Plugin) {
				let c = new Plugin();
				c.setup();
				c.load();
				c.uid = count;
				global.plugins.push(c);
				count++;
			}
		});
		console.log(global.plugins);
	}
};