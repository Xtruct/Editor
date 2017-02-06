/**
 * Created by Armaldio on 06/02/2017.
 */

module.exports = class Sprite extends Entity {
	constructor(name, path) {
		super();
		this.name = name;
		this.path = path;
	}

	preload() {
		game.load.image(this.name, this.path);
	}

	setActions() {
		//this.addXXX(name, script, description);

		this.addAction("Set X", "SetX", "Set X position of the sprite");
		this.addExpression("Get X", "GetX", "Get X position of the sprite");
	}
};