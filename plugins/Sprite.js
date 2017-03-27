let Entity = x.require("plugins.Entity");

/**
 * Sprite plugin
 * @type {Sprite}
 */
module.exports = class Sprite extends Entity {
	constructor (texture) {
		super();
		this.texture = texture;
		this.icon    = "Sprite.png";
		this.description = "A basic sprite"
	}

	/**
	 * Run on preload
	 */
	preload () {
		game.load.image(this.name, this.path);
	}

	/**
	 * Specify core functions of the plugin
	 */
	setup () {
		//this.addXXX(name, script, description);

		this.addAction("Set X", "SetX", "Set X position of the sprite", () => {
		});

		this.addExpression("Get X", "GetX", "Get X position of the sprite", () => {
		});
	}

	/**
	 * Must exists, otherwise will not be instantiable
	 * Run once the plugin in loaded into the editor
	 */
	load () {

	}
};