var game = new Phaser.Game(1200, 800, Phaser.CANVAS, '');
game.state.add('Boot',Boot);
game.state.add('StartPage',StartPage);
game.state.add('Game',Game);
game.state.start('Boot');
