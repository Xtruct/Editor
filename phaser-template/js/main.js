// Create the Phaser game instance.
let game = new Phaser.Game(800, 600, Phaser.AUTO, '');
window.game = game;

game.state.add('init', initState);
game.state.add('load', loadState);
game.state.add('game', gameState);

console.log('main');

game.state.start('init');
