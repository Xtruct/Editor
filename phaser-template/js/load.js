let loadState = {
    preload: function () {
        window.runtime = {};

        console.log('load');

        /**
	 * Images
	 */
        game.load.image('loading-bar', 'assets/images/loading-bar.png');
        game.load.image('loading-bar-bg', 'assets/images/loading-bar-bg.png');

        /**
         * Load files
         */
        game.load.text("objects", "scenes/scene1.xscn");

        /**
         * Bitmap
         */
        //game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');

    },


    create: function () {
        let instances = window.instances = [];

		game.stage.backgroundColor = "#222";

		bar = game.add.image(game.world.centerX, game.world.centerY, 'loading-bar');
        bar.anchor.set(0.5);

        let bar_bg = game.add.sprite(game.world.centerX, game.world.centerY, 'loading-bar-bg');
        bar_bg.anchor.set(0.5);

        instances.push(bar);
        instances.push(bar_bg);


        const style = {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        loadingText = game.add.text(0, 0, "Loading...", style);
        loadingText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        loadingText.setTextBounds(0, game.world.centerY, game.world.width, 100);

        let objects = JSON.parse(game.cache.getText("objects")).objects;
        window.runtime.objects = objects;
        console.log(window.runtime);
        bar.width = 0;
        for (let object of objects) {
            //bar.width += 350 / objects.length;
        }

        //Just to fake a login
        game.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
            bar.width += 350 / objects.length;

            game.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
                bar.width += 350 / objects.length;

                game.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
                    bar.width += 350 / objects.length;

                    game.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
                        game.state.start('game');
                    }, this);

                }, this);

            }, this);

        }, this);
    },

    update: function () {
    },

    render: function () {
        game.debug.spriteInfo(bar, 32, 32);
    }
}