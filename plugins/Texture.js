let Entity = x.require("plugins.Entity");

module.exports = class Texture extends Entity {
	constructor (path) {
		super();
		this.path = path;
	}

	preload () {
		game.load.image(this.name, this.path);
	}

	setup () {
		//this.addAction(name, scriptname, description, function);
		this.addAction("Set texture", "SetTexture", "Set texture", () => {
			console.log("Setting texture");
		});
	}

	load () {

	}
};