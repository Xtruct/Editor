let $            = require("jquery");
let GoldenLayout = require("golden-layout");
let low          = require('lowdb');

require("materialize-css");

const db = low('db.json');


module.exports = class Layout {
	constructor() {
		this.config = {
			"settings"       : {
				"hasHeaders"              : true,
				"constrainDragToContainer": true,
				"reorderEnabled"          : true,
				"selectionEnabled"        : true,
				"popoutWholeStack"        : false,
				"blockedPopoutsThrowError": false,
				"closePopoutsOnUnload"    : false,
				"showPopoutIcon"          : false,
				"showMaximiseIcon"        : false,
				"showCloseIcon"           : false
			},
			"dimensions"     : {
				"borderWidth"    : 5,
				"minItemHeight"  : 10,
				"minItemWidth"   : 10,
				"headerHeight"   : 20,
				"dragProxyWidth" : 300,
				"dragProxyHeight": 200
			},
			"labels"         : {
				"close"   : "close",
				"maximise": "maximise",
				"minimise": "minimise",
				"popout"  : "open in new window",
				"popin"   : "pop in"
			},
			"content"        : [{
				"type"          : "column",
				"isClosable"    : true,
				"reorderEnabled": true,
				"title"         : "",
				"width"         : 100,
				"content"       : [{
					"type"          : "row",
					"isClosable"    : true,
					"reorderEnabled": true,
					"title"         : "",
					"height"        : 87.04402515723272,
					"content"       : [{
						"type"          : "row",
						"isClosable"    : true,
						"reorderEnabled": true,
						"title"         : "",
						"height"        : 100,
						"width"         : 85.8485639686684,
						"content"       : [{
							"type"           : "stack",
							"isClosable"     : true,
							"reorderEnabled" : true,
							"title"          : "",
							"activeItemIndex": 0,
							"width"          : 15.245799626633477,
							"content"        : [{
								"type"          : "component",
								"componentName" : "Objects",
								"componentState": {"text": "Component 1"},
								"isClosable"    : false,
								"reorderEnabled": true,
								"title"         : "Objects"
							}]
						}, {
							"type"          : "column",
							"isClosable"    : true,
							"reorderEnabled": true,
							"title"         : "",
							"width"         : 84.75420037336652,
							"content"       : [{
								"type"           : "stack",
								"isClosable"     : true,
								"reorderEnabled" : true,
								"title"          : "",
								"activeItemIndex": 2,
								"width"          : 71.66900420757362,
								"height"         : 85.8806404657933,
								"content"        : [{
									"type"          : "component",
									"componentName" : "Layout",
									"componentState": {"text": "Component 2"},
									"isClosable"    : false,
									"reorderEnabled": true,
									"title"         : "Layout"
								}, {
									"type"          : "component",
									"componentName" : "Preview",
									"componentState": {"text": "Component 2"},
									"isClosable"    : false,
									"reorderEnabled": true,
									"title"         : "Preview"
								}, {
									"type"          : "component",
									"componentName" : "Editor",
									"componentState": {"text": "Component 2"},
									"isClosable"    : false,
									"reorderEnabled": true,
									"title"         : "Editor"
								}]
							}, {
								"type"           : "stack",
								"isClosable"     : true,
								"reorderEnabled" : true,
								"title"          : "",
								"activeItemIndex": 0,
								"height"         : 14.1193595342067,
								"content"        : [{
									"type"          : "component",
									"componentName" : "EditorConsole",
									"componentState": {"text": "Component 2"},
									"isClosable"    : false,
									"reorderEnabled": true,
									"title"         : "Editor Console"
								}]
							}, {
								"type"           : "stack",
								"isClosable"     : true,
								"reorderEnabled" : true,
								"title"          : "",
								"activeItemIndex": 0,
								"height"         : 14.1193595342067,
								"content"        : [{
									"type"          : "component",
									"componentName" : "GameConsole",
									"componentState": {"text": "Component 2"},
									"isClosable"    : false,
									"reorderEnabled": true,
									"title"         : "Game Console"
								}]
							}]
						}]
					}, {
						"type"           : "stack",
						"isClosable"     : true,
						"reorderEnabled" : true,
						"title"          : "",
						"activeItemIndex": 0,
						"width"          : 14.151436031331587,
						"content"        : [{
							"type"          : "component",
							"componentName" : "Properties",
							"componentState": {"text": "Component 3"},
							"isClosable"    : false,
							"reorderEnabled": true,
							"title"         : "Properties"
						}]
					}]
				}]
			}],
			"isClosable"     : true,
			"reorderEnabled" : true,
			"title"          : "",
			"openPopouts"    : [],
			"maximisedItemId": null
		};

		let state = db.get('layout.state').value();

		if (state !== undefined) {
			this.config = JSON.parse(state);
		}

		/*
		$.get("layout/Navbar.html", (response) => {
			$("#navbar").html(response);
		});
		*/

		this.goldenLayout = new GoldenLayout(this.config);
	};

	setup() {
		this.goldenLayout.registerComponent('Objects', function (container, state) {
			$.get("layout/Objects.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Layout', function (container, state) {
			$.get("layout/Layout.html", (response) => {
				container.getElement().html(response);
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
			});
		});

		this.goldenLayout.registerComponent('GameConsole', function (container, state) {
			/*
			 $.get("layout/Console.html", (response) => {
			 container.getElement().html(response);
			 });
			 */
			container.getElement().html('<div id="gameconsole"></div>');
		});

		this.goldenLayout.registerComponent('EditorConsole', function (container, state) {
			/*
			 $.get("layout/Console.html", (response) => {
			 container.getElement().html(response);
			 });
			 */
			container.getElement().html('<div id="editorconsole"></div>');
		});

		this.goldenLayout.init();

		this.goldenLayout.on('stateChanged', () => {
			let state = JSON.stringify(this.goldenLayout.toConfig());
			this.saveLayout(state);
		});
	};

	saveLayout(layout) {
		db.set('layout.state', layout)
			.value()
	};
};