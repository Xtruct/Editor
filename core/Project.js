/**
 * Created by Armaldio on 06/02/2017.
 */

const fs     = require("fs");
const path   = require("path");
const mkdirp = require("mkdirp");

const _Console = req("core/Console.js");
let Console    = new _Console();

const _ConfigurationLoader = req("core/ConfigurationLoader.js");
let ConfigurationLoader    = new _ConfigurationLoader();

const dialog = require('electron').remote.dialog;
let window   = require('electron').remote.getCurrentWindow();

const LEFT_CLICK   = 1;
const MIDDLE_CLICK = 2;
const RIGHT_CLICK  = 3;

module.exports = class Project {
	constructor () {
		this.projectPath = "";
	};

	newProject () {
		let self = this;

		dialog.showOpenDialog(window, {
			properties: ['openDirectory', 'createDirectory']
		}, (pathname) => {
			let p            = pathname[0];
			self.projectPath = p;

			//Create project file
			fs.writeFileSync(path.join(p, "Project.xtruct"), ConfigurationLoader.load("defaultproject", false), 'utf8');
			Console.editor.say("Project file created");

			//Create assets folder
			mkdirp(path.join(p, "assets"), function (err) {
				if (err) console.error(err); else Console.editor.say('Assets created!')
			});

			//Create scenes folder
			mkdirp(path.join(p, "scenes"), function (err) {
				if (err) console.error(err); else Console.editor.say('Scenes created!')
			});

			//Create objects folder
			mkdirp(path.join(p, "objects"), function (err) {
				if (err) console.error(err); else Console.editor.say('Objects creted!')
			});

		});
	};

	load (p) {
		global.project     = JSON.parse(fs.readFileSync(p, 'utf8'));
		global.projectPath = path.dirname(p);

		$("#project-name").text(global.project.name);
		console.log(global.project.name);

		this.loadScenes(global.project.startScene);
	};

	loadAskPath () {
		dialog.showOpenDialog(window, {
			properties: ['openFile']
		}, (pathname) => {
			let p = pathname[0];
			this.load(p);
		});
	}

	loadScenes (scene) {

		let canvas = this.canvasSetup();

		let camera = new fabric.Rect({
			left       : 500,
			top        : 500,
			width      : 50,
			height     : 50,
			fill       : "",
			stroke     : "green", //strokeDashArray: [1, 1],
			strokeWidth: 1
		});

		canvas.loadFromJSON(fs.readFileSync(path.join(global.projectPath, "scenes", global.project.startScene + ".xscn"), 'utf8'), canvas.renderAll.bind(canvas), function (o, object) {
			canvas.add(camera);
			camera.sendToBack();
		});

		$("#currentLayout").show();

		this.resizeCanvas(canvas);
	}

	resizeCanvas (canvas) {

		let layout = $("#layout");

		canvas.setHeight(layout.parent().height() * 0.95);
		canvas.setWidth(layout.parent().width() * 0.95);
		canvas.renderAll();
	}

	canvasSetup () {
		let canvas = new fabric.Canvas('currentLayout');

		let panning = false;

		//Manage panning and selection
		canvas.on('mouse:up', function (e) {
			if (e.e.which == MIDDLE_CLICK) {
				panning          = false;
				canvas.selection = true;
			}
		});

		canvas.on('mouse:down', function (e) {
			if (e.e.which == MIDDLE_CLICK) {
				panning          = true;
				canvas.selection = false
			}
		});
		canvas.on('mouse:move', function (e) {
			if (panning && e && e.e && e.e.which == MIDDLE_CLICK) {
				let units = 10;
				let delta = new fabric.Point(e.e.movementX, e.e.movementY);
				canvas.relativePan(delta);
			}
		});

		//Resize object stroke on scale
		canvas.observe('object:modified', function (e) {
			e.target.resizeToScale();
		});

		fabric.Object.prototype.resizeToScale = function () {
			switch (this.type) {
				case "circle":
					this.radius *= this.scaleX;
					this.scaleX = 1;
					this.scaleY = 1;
					break;
				case "ellipse":
					this.rx *= this.scaleX;
					this.ry *= this.scaleY;
					this.width  = this.rx * 2;
					this.height = this.ry * 2;
					this.scaleX = 1;
					this.scaleY = 1;
					break;
				case "polygon":
				case "polyline":
					let points = this.get('points');
					for (let i = 0; i < points.length; i++) {
						let p = points[i];
						p.x *= this.scaleX;
						p.y *= this.scaleY;
					}
					this.scaleX = 1;
					this.scaleY = 1;
					this.width  = this.getBoundingBox().width;
					this.height = this.getBoundingBox().height;
					break;
				case "triangle":
				case "line":
				case "rect":
					this.width *= this.scaleX;
					this.height *= this.scaleY;
					this.scaleX = 1;
					this.scaleY = 1;
				default:
					break;
			}
		};

		fabric.Object.prototype.getBoundingBox = function () {
			let minX = null;
			let minY = null;
			let maxX = null;
			let maxY = null;
			switch (this.type) {
				case "polygon":
				case "polyline":
					let points = this.get('points');

					for (let i = 0; i < points.length; i++) {
						if (typeof (minX) == undefined) {
							minX = points[i].x;
						} else if (points[i].x < minX) {
							minX = points[i].x;
						}
						if (typeof (minY) == undefined) {
							minY = points[i].y;
						} else if (points[i].y < minY) {
							minY = points[i].y;
						}
						if (typeof (maxX) == undefined) {
							maxX = points[i].x;
						} else if (points[i].x > maxX) {
							maxX = points[i].x;
						}
						if (typeof (maxY) == undefined) {
							maxY = points[i].y;
						} else if (points[i].y > maxY) {
							maxY = points[i].y;
						}
					}
					break;
				default:
					minX = this.left;
					minY = this.top;
					maxX = this.left + this.width;
					maxY = this.top + this.height;
			}
			return {
				topLeft    : new fabric.Point(minX, minY),
				bottomRight: new fabric.Point(maxX, maxY),
				width      : maxX - minX,
				height     : maxY - minY
			}
		};

		//Zoom
		document.addEventListener("mousewheel", function (e) {
			let evt     = window.event || e;
			let delta   = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
			let curZoom = canvas.getZoom(), newZoom = curZoom + delta / 4000, x = e.offsetX, y = e.offsetY;
			//applying zoom values.
			canvas.zoomToPoint({x   : x,
								   y: y
							   }, newZoom);
			if (e != null) e.preventDefault();
			return false;
		}, false);

		//Set default selector
		fabric.Object.prototype.set({
										transparentCorners: false,
										cornerColor       : '#0000ff',
										borderColor       : '#ff0000',
										cornerSize        : 12,
										padding           : 5
									});

		canvas.selectionBorderColor = 'rgba(255, 0, 0, 0.3)';
		canvas.setBackgroundColor('rgba(220, 220, 220, 1)', canvas.renderAll.bind(canvas));

		return (canvas);
	}
};