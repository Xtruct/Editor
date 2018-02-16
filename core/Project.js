const fs     = require('fs');
const path   = require('path');
const mkdirp = require('mkdirp');
const low    = require('lowdb');
const server = require('node-static');
const tmp    = require('tmp');
const opn    = require('opn');
const copy   = require('recursive-copy');

const db = low('db.json');

const Preview = x.require('core.Preview');
const Console = x.require('core.Console');

const ConfigurationLoader = x.require('core.ConfigurationLoader', true);

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

            let err;

            //Create assets folder
            err = mkdirp(path.join(p, 'assets'));
            if (err) console.error(err); else Console.say('Assets created!');

            //Create scenes folder
            err = mkdirp(path.join(p, 'scenes'));
            if (err) console.error(err); else Console.say('Scenes created!');

            //Create objects folder
            err = mkdirp(path.join(p, 'objects'));
            if (err) console.error(err); else Console.say('Objects created!');

            //Create project file
            fs.writeFileSync(path.join(p, 'Project.xtruct'), ConfigurationLoader.load('defaultproject', false), 'utf8');
            fs.writeFileSync(path.join(p, 'scenes/start.xscn'), '{}', 'utf8');
            Console.say('Project file created');

            this.load(path.join(p, 'Project.xtruct'));
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
        console.log(p);

        global.Editor.project     = JSON.parse(fs.readFileSync(p, 'utf8'));
        global.Editor.projectPath = path.dirname(p);

        console.log(global.Editor);

        db.set('editor.lastProjectPath', p).value();

        $('#project-name').text(global.Editor.project.name);
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

        global.Editor.canvas       = this.canvasSetup();
        global.Editor.currentScene = scene;

        let sceneAsJson = JSON.parse(fs.readFileSync(path.join(global.Editor.projectPath, 'scenes', `${scene}.xscn`), 'utf8'));

        /**
		 * Load as json by changing src to correct path
		 */
        $.each(sceneAsJson.objects, (index, value) => {
            if (value.type === 'image') {
                let src = value.src;
                //console.log(global.Editor.projectPath.split(path.sep).pop());
                let dir = global.Editor.projectPath.split(path.sep).pop();
                src = path.join(dir, src);
                sceneAsJson.objects[index].src = src;
            }
        });
        //------------------

        global.Editor.canvas.loadFromJSON(sceneAsJson, () => {
            global.Editor.canvas.renderAll.bind(global.Editor.canvas);

            let w = global.Editor.project.windowWidth;
            let h = global.Editor.project.windowHeight;

            console.log(w, h);

            let sceneRect = new fabric.Rect({
                left: 0,
                top : 0,
                fill: 'rgba(240, 240, 240, 1)',
            });

            sceneRect.lockMovementX = sceneRect.lockMovementY = true;
            sceneRect.selectable = false;
            sceneRect.evented    = false;
            sceneRect.setWidth(w - 1);
            sceneRect.setHeight(h - 1);
            sceneRect.excludeFromExport = true;
            global.Editor.canvas.add(sceneRect);
            sceneRect.sendToBack();

            global.Editor.canvas.renderAll();

            this.resizeCanvas(global.Editor.canvas);
            $('#currentLayout').show();
        }, (o, object) => {

            console.log('O', o, 'Object', object);
            console.log('Canvas.TOJson', global.Editor.canvas.toJSON());
        });
    }

    /**
	 * Resize canvas
	 * @param canvas
	 */
    resizeCanvas (canvas) {

        let layout = $('#layout');

        canvas.setHeight(layout.parent().height());
        canvas.setWidth(layout.parent().width());
        canvas.renderAll();
    }

    /**
	 * Setup canvas
	 * @returns {*}
	 */
    canvasSetup () {
        let canvas = new fabric.Canvas('currentLayout');

        let panning = false;

        /* //Manage panning and selection
        canvas.on('mouse:up', (e) => {
            console.log('Mouse up');
            if (e.e.which === MIDDLE_CLICK) {
                panning          = false;
                canvas.selection = true;
            }
        });*/

        canvas.on('mouse:down', (e) => {
            /*console.log('Mouse down');

            if (e.e.which === MIDDLE_CLICK) {
                console.log('Middle click');

                panning          = true;
                canvas.selection = false;
            }*/
        });
        canvas.on('mouse:move', (e) => {
            if (panning && e && e.e && e.e.which === MIDDLE_CLICK) {
                let units = 10;
                let delta = new fabric.Point(e.e.movementX, e.e.movementY);
                canvas.relativePan(delta);
            }

            let pointer = canvas.getPointer(event.e);
            let posX    = pointer.x;
            let posY    = pointer.y;

            $('#mouse-pos').text(`x: ${Math.round(posX)}, y: ${Math.round(posY)}`);

        });

        canvas.on('object:selected', (s) => {
            let p = s.target;
            $('#selection-pos').text(`x : ${Math.round(p.left)}, y : ${Math.round(p.top)}`);
        });

        //Resize object stroke on scale
        canvas.observe('object:modified', (e) => {
            //e.target.resizeToScale();
        });

        //Better scale without losing aspect ratio
        fabric.Object.prototype.resizeToScale = function () {
            switch (this.type) {
                case 'circle':
                    this.radius *= this.scaleX;
                    this.scaleX = 1;
                    this.scaleY = 1;
                    break;
                case 'ellipse':
                    this.rx *= this.scaleX;
                    this.ry *= this.scaleY;
                    this.width  = this.rx * 2;
                    this.height = this.ry * 2;
                    this.scaleX = 1;
                    this.scaleY = 1;
                    break;
                case 'polygon':
                case 'polyline':
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
                case 'triangle':
                case 'line':
                case 'rect':
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
                case 'polygon':
                case 'polyline':
                    let points = this.get('points');

                    for (let i = 0; i < points.length; i++) {
                        if (minX === undefined) {
                            minX = points[i].x;
                        } else if (points[i].x < minX) {
                            minX = points[i].x;
                        }
                        if (minY === undefined) {
                            minY = points[i].y;
                        } else if (points[i].y < minY) {
                            minY = points[i].y;
                        }
                        if (maxX === undefined) {
                            maxX = points[i].x;
                        } else if (points[i].x > maxX) {
                            maxX = points[i].x;
                        }
                        if (maxY === undefined) {
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
            };
        };

        //Zoom
        document.addEventListener('mousewheel', (e) => {
            let evt     = window.event || e;
            let delta   = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
            let curZoom = canvas.getZoom();
            let newZoom = curZoom + delta / 5000;
            let x       = e.offsetX;
            let y       = e.offsetY;

            if (newZoom < 0.05)
                newZoom = 0.05;
            if (newZoom > 3)
                newZoom = 3;

            $('#zoom-level').text(`Zoom: ${Math.round(newZoom * 100)}%`);
            //applying zoom values.
            canvas.zoomToPoint({
                x: x,
                y: y
            }, newZoom);
            if (e !== null) e.preventDefault();
            return false;
        }, false);

        $(document).on('dblclick', () => {
            $('#objects-modal-list').empty();
            $.each(global.Editor.plugins, (index, value) => {
                if (!value.instanciable)
                    return true;
                $('#objects-modal-list').append(`<div class="col s2 section center">
					<div class="avail-plugins" data-uid="${value.uid}">
                		<img class="center" height="48" src="${ROOT.toString() + '/plugins/' + (value.icon === '' ? 'Default.png' : value.icon)}" alt="icon">
                		<p>${value.name}</p>
                	</div>
            	</div>`);
            });

            $('#chooseObjectModal').modal('open');
        });

        $('#modalValidateAddObject').on('click', () => {
            let uid = $('.avail-plugins.selected').data('uid');

            //this.addEntity(global.Editor.plugins[uid]);
            console.log('Adding ', global.Editor.plugins[uid]);
        });

        $(document).on('click', '.avail-plugins', (el) => {
            let item = $(el.currentTarget);

            $('.avail-plugins').removeClass('selected');
            item.addClass('selected');

            $('.avail-plugins').css('background-color', '#212121');
            item.css('background-color', '#353535');

            console.log(item);
            let pluginId = item.data('uid');
            console.log('Plugin Id', pluginId);

            let plugin = global.Editor.plugins[pluginId];
            $('#modal-description').html(`
					<p><b>${plugin.inheritanceTree.join('</b> > <b>')}</b></p>
					<p>${(plugin.description === undefined ? '<b>No description</b>' : plugin.description)}</p>`);
            //			modalValidateAddObject
        });

        //Set default selector
        fabric.Object.prototype.set({
            transparentCorners      : false,
            cornerColor             : '#0070ff',
            borderColor             : '#ff4800',
            cornerSize              : 10,
            padding                 : 10,
            selectionBackgroundColor: '#c1d2e7'
        });

        canvas.selectionBorderColor = 'rgba(255, 0, 0, 0.3)';
        canvas.setBackgroundColor('rgba(21, 21, 21, 1)', canvas.renderAll.bind(canvas));

        return (canvas);
    }

    /**
	 * Load textures from project
	 */
    loadTextures () {
        let textures = global.Editor.project.textures;
        textures     = [{
            name: 'paddle',
            path: 'paddle.png'
        }, {
            name: 'gamepad',
            path: 'gamepad.svg'
        }, {
            name: 'ball',
            path: 'ball.png'
        }, {
            name: 'paddle',
            path: 'paddle.png'
        }, {
            name: 'gamepad',
            path: 'gamepad.svg'
        }, {
            name: 'ball',
            path: 'ball.png'
        }];

        $('#texture-modal-list').empty();
        $.each(textures, (index, value) => {
            $('#texture-modal-list').append(`<div class="col s3 section center">
                <img class="center" height="32" src="${global.Editor.projectPath}/assets/${value.path}" alt="icon">
                <h5>${value.name}</h5>
            </div>`);
        });
    };

    /**
	 * Run the project in chrome
	 */
    openExternal () {
        /*
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

    export () {
        dialog.showOpenDialog(window, {
            properties: ['openDirectory', 'createDirectory']
        }, (pathname) => {
            let p = pathname[0];

            console.log('Export to ' + p);

            copy(path.join(ROOT.toString(), 'phaser-template'), p, {overwrite: true})
                .then((results) => {
                    console.info('Copied ' + results.length + ' files');

                    console.log(global.Editor.projectPath);

                    copy(global.Editor.projectPath, p, {overwrite: true})
                        .then((results) => {
                            console.info('Copied ' + results.length + ' files');

                        })
                        .catch((error) => {
                            console.error('Copy failed: ' + error);
                        });
                })
                .catch((error) => {
                    console.error('Copy failed: ' + error);
                });
        });
    }
};
