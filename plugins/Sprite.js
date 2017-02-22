/**
 * Created by Armaldio on 06/02/2017.
 */

let Entity = req("plugins/Entity.js");

module.exports = class Sprite extends Entity {
	constructor (texture) {
		super("Sprite", "sprite");
		this.texture = texture;

		this.setup();
	}

	preload () {
		game.load.image(this.name, this.path);
	}

	setup () {
		//this.addXXX(name, script, description);

		this.addAction(
			"Set X", "SetX", "Set X position of the sprite", () => {
			});

		this.addExpression(
			"Get X", "GetX", "Get X position of the sprite", () => {
			});
	}

	//Must exists, otherwise will not be instantiable
	load () {

	}
};