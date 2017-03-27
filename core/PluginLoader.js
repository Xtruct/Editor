module.exports = class PluginLoader {
	constructor () {
	}

	creatGamePlugin () {
		fabric.NamedImage = fabric.util.createClass(fabric.Image, {

			type: 'named-image',

			initialize: function (element, options) {
				this.callSuper('initialize', element, options);
				options && this.set('name', options.name);
			},

			toObject: function () {
				return fabric.util.object.extend(this.callSuper('toObject'), {name: this.name});
			}
		});
	}

	loadPlugins () {
		let count   = 0;
		let plugins = require('require-all')({
			dirname: ROOT.toString() + "/plugins", //filter : /(.+Controller)\.js$/,
			resolve: function (Plugin) {
				let c = new Plugin();
				c.setup();
				c.load();
				c.uid = count;
				global.Editor.plugins.push(c);
				count++;
			}
		});
		console.table(global.Editor.plugins);
	}
};