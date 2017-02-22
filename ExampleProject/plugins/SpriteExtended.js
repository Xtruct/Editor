/**
 * Created by Armaldio on 06/02/2017.
 */

module.exports = class SpriteExtended extends Sprite {
	constructor (name, texture) {
		super(name, "sprite");
		this.texture = texture;

		this.setup();
	}

	preload () {
		game.load.image(this.name, this.path);
	}

	setup () {
		//this.addXXX(name, script, description);

		this.addAction("Set X", "SetX", "Set X position of the sprite", () => {
		});

		this.addExpression("Get X", "GetX", "Get X position of the sprite", () => {
		});
	}
};