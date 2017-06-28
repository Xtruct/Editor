let gameState = {
	preload: function () {
		var game = window.game;

		var i = 0;
		for (let object of window.runtime.objects) {

			game.load.image('img' + i, object.src);

			i++;
		}
	},

	create: function () {
		var game = window.game;

		var i = 0;
		for (let object of window.runtime.objects) {
			console.log(object);

			game.add.sprite(object.left, object.top, 'img' + i);

			i++;
		}
	}
};