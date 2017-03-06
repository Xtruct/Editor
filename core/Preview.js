window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

let Console = require("./Console.js");

let out = new Console();

module.exports = class Preview {
	constructor() {
		this.$game = $("#game");
		this.size  = {
			width : 600,
			height: 400
		}

	};

	start() {
		let game = new Phaser.Game(this.size.width, this.size.height, Phaser.AUTO, 'game', {
			preload: preload,
			create : create,
			update : update
		});

		let pad1;
		let pad2;
		let ball;
		let ballVelocity = 400;
		let ballLaunched = false;

		function preload() {
			game.time.advancedTiming = true;

			game.stage.backgroundColor = "#ffffff";

			game.load.image('pad', 'ExampleProject/assets/paddle.png');
			game.load.image('ball', 'ExampleProject/assets/ball.png');
		}

		function create() {
			game.physics.startSystem(Phaser.Physics.ARCADE);

			pad1 = createPaddle(0, game.world.centerY);
			pad2 = createPaddle(game.world.width - 4, game.world.centerY);

			ball = createBall(game.world.centerX, game.world.centerY);

			game.input.onDown.add(launchBall, this);
		}

		function update() {
			controlPaddle(pad1, game.input.y);

			game.physics.arcade.collide(pad1, ball);
			game.physics.arcade.collide(pad2, ball);

			controlPaddle(pad2, ball.y);

			if (ball.body.blocked.left)
				out.game.say("Player 2 Scored");
			else if (ball.body.blocked.right)
				out.game.say("Player 1 Scored");

			game.debug.text(game.time.fps + " FPS" || '--', 2, 14, "#00ff00");
		}

		function launchBall() {
			if (ballLaunched) {
				ball.x = game.world.centerX;
				ball.y = game.world.centerY;
				ball.body.velocity.setTo(0, 0);
				ballLaunched = false;
			}
			else {
				ball.body.velocity.x = -ballVelocity;
				ball.body.velocity.y = ballVelocity;
				ballLaunched         = true;
			}
		}

		function createPaddle(x, y) {
			let paddle = game.add.sprite(x, y, "pad");
			paddle.anchor.setTo(.5, .5);
			paddle.scale.setTo(0.25, 0.25);
			game.physics.arcade.enable(paddle);
			paddle.body.collideWorldBounds = true;
			paddle.body.imovable           = true;
			return (paddle);
		}

		function createBall(x, y) {
			let ball = game.add.sprite(x, y, "ball");
			ball.anchor.setTo(.5, .5);
			ball.scale.setTo(.25, .25);
			game.physics.arcade.enable(ball);
			ball.body.collideWorldBounds = true;
			ball.body.bounce.setTo(1, 1);

			return (ball);
		}

		function controlPaddle(paddle, y) {
			paddle.y = y;

			if (paddle.y < paddle.height / 2)
				paddle.y = paddle.height / 2;
			else if (paddle.y > game.world.height - paddle.height / 2)
				paddle.y = game.world.height - paddle.height / 2;
		}
	}
};

