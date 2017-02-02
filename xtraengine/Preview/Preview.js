/**
 * Created by quent on 02/02/2017.
 */

window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

let game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {
	game.load.image('star', 'assets/a.png');
}

function create() {
	game.add.sprite(0, 0, 'star');
}

function update() {

}