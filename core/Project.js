const fs     = require("fs");
const path   = require("path");
const mkdirp = require("mkdirp");
const low    = require("lowdb");
const server = require('node-static');
const tmp    = require('tmp');
const opn    = require("opn");

const db     = low('db.json');

const Preview = x.require("core.Preview");
const Console = x.require("core.Console");

const ConfigurationLoader = x.require("core.ConfigurationLoader");

const dialog = require('electron').remote.dialog;
let window   = require('electron').remote.getCurrentWindow();

const LEFT_CLICK   = 1;
const MIDDLE_CLICK = 2;
const RIGHT_CLICK  = 3;

/**
 * Project manager
 * @type {Project}
 */
module.exports = class Project {
	constructor () {
	};

	/**
	 * Create a new project
	 */
	newProject () {
		let self = this;

		//Open a dialog that ask where to save your project
		dialog.showOpenDialog(window, {
			properties: ['openDirectory', 'createDirectory']
		}, (pathname) => {
			let p            = pathname[0];
			self.projectPath = p;

			//Create project file
			fs.writeFileSync(path.join(p, "Project.xtruct"), ConfigurationLoader.load("defaultproject", false), 'utf8');
			Console.say("Project file created");

			//Create assets folder
			mkdirp(path.join(p, "assets"), function (err) {
				if (err) console.error(err); else RegularConsole.say('Assets created!')
			});

			//Create scenes folder
			mkdirp(path.join(p, "scenes"), function (err) {
				if (err) console.error(err); else RegularConsole.say('Scenes created!')
			});

			//Create objects folder
			mkdirp(path.join(p, "objects"), function (err) {
				if (err) console.error(err); else RegularConsole.say('Objects created!')
			});

		});
	};

	/**
	 * Quickly open last project
	 */
	openLast () {
		let lastPath = db.get('editor.lastProjectPath').value();
		this.load(lastPath);
	}

	/**
	 * Load a project from a .xtruct file
	 * @param p
	 */
	load (p) {
		global.Editor.project     = JSON.parse(fs.readFileSync(p, 'utf8'));
		global.Editor.projectPath = path.dirname(p);

		db.set('editor.lastProjectPath', p).value();

		$("#project-name").text(global.Editor.project.name);
		console.log(global.Editor.project.name);

		this.loadScenes(global.Editor.project.startScene);

		this.loadTextures();
	};

	/**
	 * Ask for path then load the project
	 */
	loadAskPath () {
		dialog.showOpenDialog(window, {
			properties: ['openFile']
		}, (pathname) => {
			let p = pathname[0];
			this.load(p);
		});
	}

	/**
	 * Load scenes from project
	 * @param {Object} scene
	 */
	loadScenes (scene) {

		Editor.canvas = this.canvasSetup();

		let sceneAsJson = JSON.parse(fs.readFileSync(path.join(Editor.projectPath, "scenes", `${scene}.xscn`), 'utf8'));
		Editor.canvas.loadFromJSON(sceneAsJson, Editor.canvas.renderAll.bind(Editor.canvas), (o, object) => {

			console.log(o, object);
			console.log(Editor.canvas.toJSON());
		});

		this.resizeCanvas(Editor.canvas);
		$("#currentLayout").show();
	}

	/**
	 * Resize canvas
	 * @param canvas
	 */
	resizeCanvas (canvas) {

		let layout = $("#layout");

		canvas.setHeight(layout.parent().height() * 0.95);
		canvas.setWidth(layout.parent().width() * 0.95);
		canvas.renderAll();
	}

	/**
	 * Setup canvas
	 * @returns {*}
	 */
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

		//Better scale without losing aspect ratio
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
			canvas.zoomToPoint({
				x: x,
				y: y
			}, newZoom);
			if (e != null) e.preventDefault();
			return false;
		}, false);

		$(document).on("dblclick", () => {
			$("#objects-modal-list").empty();
			$.each(global.Editor.plugins, (index, value) => {
				if (!value.instanciable)
					return true;
				$("#objects-modal-list").append(`<div class="col s2 section center">
					<div class="avail-plugins" data-uid="${value.uid}">
                		<img class="center" height="48" src="${ROOT.toString() + "/plugins/" + (value.icon === "" ? "Default.png" : value.icon)}" alt="icon">
                		<p>${value.name}</p>
                	</div>
            	</div>`);
			});

			$("#chooseObjectModal").modal('open');
		});

		$("#modalValidateAddObject").on("click", () => {
			let uid = $(".avail-plugins.selected").data("uid");

			//this.addEntity(global.Editor.plugins[uid]);
			console.log("Adding ", global.Editor.plugins[uid]);
		});

		$(document).on("click", ".avail-plugins", (el) => {
			let item = $(el.currentTarget);

			$(".avail-plugins").removeClass("selected");
			item.addClass("selected");

			$(".avail-plugins").css("background-color", "#212121");
			item.css("background-color", "#353535");

			console.log(item);
			let pluginId = item.data("uid");
			console.log("Plugin Id", pluginId);

			let plugin = global.Editor.plugins[pluginId];
			$("#modal-description").html(`
					<p><b>${plugin.inheritanceTree.join("</b> > <b>")}</b></p>
					<p>${(plugin.description === undefined ? "<b>No description</b>" : plugin.description)}</p>`);
			//			modalValidateAddObject
		});

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

	/**
	 * Load textures from project
	 */
	loadTextures () {
		let textures = Editor.project.textures;
		textures     = [{
			name: "paddle",
			path: "paddle.png"
		}, {
			name: "gamepad",
			path: "gamepad.svg"
		}, {
			name: "ball",
			path: "ball.png"
		}, {
			name: "paddle",
			path: "paddle.png"
		}, {
			name: "gamepad",
			path: "gamepad.svg"
		}, {
			name: "ball",
			path: "ball.png"
		}];

		$("#texture-modal-list").empty();
		$.each(textures, (index, value) => {
			$("#texture-modal-list").append(`<div class="col s3 section center">
                <img class="center" height="32" src="${Editor.projectPath}/assets/${value.path}" alt="icon">
                <h5>${value.name}</h5>
            </div>`);
		});
	};

	/**
	 * Run the project in chrome
	 */
	openExternal () {/*
	 let tmpobj = tmp.dirSync();
	 console.log('Dir: ', tmpobj.name);

	 fs.writeFileSync(tmpobj.name + "/index.html", `
	 <p>Hello world!</p>`, 'utf8');

	 let folder = new server.Server(tmpobj.name);

	 opn('http://127.0.0.1:8080');
	 require('http').createServer(function (request, response) {
	 console.log(request, response);

	 request.addListener('end', function () {
	 folder.serve(request, response);

	 }).resume();
	 }).listen(8080);*/

		this.startPreview();

		//tmpobj.removeCallback();
	}

	startPreview () {
		let preview = new Preview();
		preview.start();
	}
};