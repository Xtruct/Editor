/**
 * Created by quent on 02/02/2017.
 */

window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');


module.exports = class Preview {
	constructor() {
		this.$game = $("#game");
		this.size  = {
			width : 400,
			height: 400
		}

	};

	start() {
		console.log("Starting Phaser");

		let game = new Phaser.Game(this.size.width, this.size.height, Phaser.AUTO, 'game', {
			preload: preload,
			create : create,
			update : update
		});

		function preload() {
			game.load.image('star', 'assets/a.png');
		}

		function create() {
			game.add.sprite(game.width / 2, game.height / 2, 'star');
		}

		function update() {
		}
	}
};

