let $            = require("jquery");
let GoldenLayout = require("golden-layout");
let low          = require('lowdb');
let fs           = require("fs");
let path         = require("path");

require("materialize-css");

const db = low('db.json');


module.exports = class Layout {
	constructor() {
		this.config = JSON.parse(fs.readFileSync(path.join(ROOT.toString(), "config/layout.json")));

		let state = db.get('layout.state').value();

		if (state !== undefined) {
			this.config = JSON.parse(state);
		}

		this.goldenLayout = new GoldenLayout(this.config);
	};

	setup() {
		this.goldenLayout.registerComponent('Objects', function (container, state) {
			$.get("layout/Objects.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Layout', function (container, state) {
			$.get("layout/Scene.html", (response) => {
				container.getElement().html(response);

				//TODO animated sprite https://jsfiddle.net/ryanoc/4F6sT/
				//TODO https://github.com/pixolith/fabricjs-customise-controls-extension

				// create a wrapper around native canvas element (with id="c")
				let canvas      = new fabric.Canvas('currentLayout');

				/**
				 * Set canvas selection
				 */
				canvas.selectionBorderColor = 'rgba(255, 0, 0, 0.3)';

				resizeCanvas();

				fabric.Object.prototype.set({
					transparentCorners: false,
					cornerColor: '#0000ff',
					borderColor: '#ff0000',
					cornerSize: 12,
					padding: 5
				});
				/** **/

				window.addEventListener('resize', resizeCanvas, false);

				function resizeCanvas() {

					let layout = $("#layout");

					canvas.setHeight(layout.parent().height() * 0.8);
					canvas.setWidth(layout.parent().width() * 0.8);
					canvas.renderAll();
				}

				// resize on init
				resizeCanvas();

				/**
				 * Animated sprite
				 */
				/*
				 let animated = new fabric.Image.fromURL('assets/animation.png', function (img) {
				 img.scale(0.5).set({left: 400, top: 100});
				 canvas.add(img);
				 });
				 */
				/** **/

				let pad1 = new fabric.Image.fromURL('Exampleproject/assets/paddle.png', function (img) {
					img.set({left: 16, top: (canvas.height / 2) - (img.height / 2)});
					canvas.add(img);
				});

				let pad2 = new fabric.Image.fromURL('Exampleproject/assets/paddle.png', function (img) {
					img.set({left: canvas.width - 64, top: (canvas.height / 2) - (img.height / 2)});
					canvas.add(img);
				});

				let ball = new fabric.Image.fromURL('Exampleproject/assets/ball.png', function (img) {
					img.set({left: canvas.width / 2, top: (canvas.height / 2) - (img.height / 2)});
					canvas.add(img);
				});

				/*
				 // create a rectangle object
				 let rect     = new fabric.Rect({
				 left  : 100,
				 top   : 100,
				 fill  : 'red',
				 width : 50,
				 height: 50
				 });

				 canvas.add(rect);
				 */

				canvas.renderAll();
			});
		});

		this.goldenLayout.registerComponent('Preview', function (container, state) {
			$.get("layout/Preview.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Properties', function (container, state) {
			$.get("layout/Properties.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Editor', function (container, state) {
			$.get("layout/Editor.html", (response) => {
				container.getElement().html(response);

				let options = {
					placeholderCss: {'background-color': '#ff8'},
					hintCss       : {'background-color': '#bbf'},
					onChange      : function (cEl) {
						console.log('onChange');
					},
					complete      : function (cEl) {
						console.log('complete');
					},
					isAllowed     : function (cEl, hint, target) {
						// Be carefull if you test some ul/ol elements here.
						// Sometimes ul/ols are dynamically generated and so they have not some attributes as natural ul/ols.
						// Be careful also if the hint is not visible. It has only display none so it is at the previouse place where it was before(excluding first moves before showing).
						if (target.data('module') === 'c' && cEl.data('module') !== 'c') {
							hint.css('background-color', '#ff9999');
							return false;
						}
						else {
							hint.css('background-color', '#99ff99');
							return true;
						}
					},
					opener        : {
						active   : true,
						as       : 'html',  // if as is not set plugin uses background image
						close    : '<i class="fa fa-minus c3"></i>',  // or 'fa-minus c3',  // or './imgs/Remove2.png',
						open     : '<i class="fa fa-plus"></i>',  // or 'fa-plus',  // or'./imgs/Add2.png',
						openerCss: {
							'display'     : 'inline-block',
							//'width': '18px', 'height': '18px',
							'float'       : 'left',
							'margin-left' : '-35px',
							'margin-right': '5px',
							//'background-position': 'center center', 'background-repeat': 'no-repeat',
							'font-size'   : '1.1em'
						}
					},
					ignoreClass   : 'clickable'
				};
				$('#sTree2').sortableLists(options);
				let previewBody = $('#editor').minimap();
			});
		});

		this.goldenLayout.registerComponent('GameConsole', function (container, state) {
			container.getElement().html('<div id="gameconsole"></div>');
		});

		this.goldenLayout.registerComponent('EditorConsole', function (container, state) {
			container.getElement().html('<div id="editorconsole"></div>');
		});

		this.goldenLayout.init();

		this.goldenLayout.on('stateChanged', () => {
			let state = JSON.stringify(this.goldenLayout.toConfig());
			//this.saveLayout(state);
		});
	};

	saveLayout(layout) {
		db.set('layout.state', layout)
			.value()
	};
};