let GoldenLayout = require("golden-layout");
let low          = require('lowdb');

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
				"type"          : "row",
				"isClosable"    : true,
				"reorderEnabled": true,
				"title"         : "",
				"content"       : [{
					"type"           : "stack",
					"width"          : 20,
					"isClosable"     : true,
					"reorderEnabled" : true,
					"title"          : "",
					"activeItemIndex": 0,
					"content"        : [{
						"type"          : "component",
						"componentName" : "Objects",
						"componentState": {"text": "Component 1"},
						"isClosable"    : false,
						"reorderEnabled": true,
						"title"         : "Objects"
					}]
				}, {
					"type"           : "stack",
					"width"          : 60,
					"isClosable"     : true,
					"reorderEnabled" : true,
					"title"          : "",
					"activeItemIndex": 0,
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
					}]
				}, {
					"type"           : "stack",
					"width"          : 20,
					"isClosable"     : true,
					"reorderEnabled" : true,
					"title"          : "",
					"activeItemIndex": 0,
					"content"        : [{
						"type"          : "component",
						"componentName" : "Properties",
						"componentState": {"text": "Component 3"},
						"isClosable"    : false,
						"reorderEnabled": true,
						"title"         : "Properties"
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

		this.goldenLayout = new GoldenLayout(this.config);
	};

	setup() {
		this.goldenLayout.registerComponent('Objects', function (container, state) {
			$.get("layout/Objects.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Layout', function (container, state) {
			$.get("layout/Objects.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Preview', function (container, state) {
			$.get("layout/Preview.html", (response) => {
				container.getElement().html(response);
			});
		});

		this.goldenLayout.registerComponent('Properties', function (container, state) {
			$.get("layout/Objects.html", (response) => {
				container.getElement().html(response);
			});
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