let Entity = req("plugins/Entity.js");

/**
 * Camera plugin
 * @type {Camera}
 */
module.exports = class Camera extends Entity {
	constructor () {
		super();
		this.description = "A basic camera";
		this.size        = {
			width : 800,
			height: 600
		};
		this.position    = {
			x: 0,
			y: 0
		};
		this.draw        = new fabric.Rect({
			left       : 500,
			top        : 500,
			width      : 50,
			height     : 50,
			fill       : "",
			stroke     : "green", //strokeDashArray: [1, 1],
			strokeWidth: 1
		});
	}

	/**
	 * Run on preload
	 */
	preload () {
		//game.load.image(this.name, this.path);
	}

	/**
	 * Specify core functions of the plugin
	 */
	setup () {
	}

	/**
	 * Must exists, otherwise will not be instantiable
	 * Run once the plugin in loaded into the editor
	 */
	load () {

	}
};