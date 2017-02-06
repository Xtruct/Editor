/**
 * Created by Armaldio on 06/02/2017.
 */

module.exports = class Texture extends Entity {
	constructor(name, path) {
		super();
		this.name = name;
		this.path = path;
	}

	preload() {
		game.load.image(this.name, this.path);
	}

	setActions()
	{
		//this.addAction(name, script, description);
		this.addAction("Get texture", "GetTexture", "get the ")
	}

	setConditions()
	{

	}

	setExpressions()
	{

	}
};