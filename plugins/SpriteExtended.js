let Sprite = x.require("plugins.Sprite");

/**
 * An extended sprite plugin
 * @type {SpriteExtended}
 */
module.exports = class SpriteExtended extends Sprite {
	constructor (name, texture) {
		super();
		this.texture = texture;

		this.setup();
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
};