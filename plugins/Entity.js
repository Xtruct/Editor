const Console = x.require("core.Console");

/**
 * The base type for plugins
 * @type {Entity}
 */
module.exports = class Entity {
	constructor () {
		this.actions      = [];
		this.conditions   = [];
		this.expressions  = [];
		this.icon         = "";
		this.instanciable = true;
	}

	setup () {

	}

	/**
	 * Get name of the instance
	 */
	get name () {
		return this.constructor.name
	}

	/**
	 * Get name of instance parent
	 */
	get parentName () {
		return Object.getPrototypeOf(this.constructor).name
	}

	/**
	 * Get full parent tree
	 * @returns {Array.<*>}
	 */
	get inheritanceTree () {
		let path = [];
		let obj  = this;

		while (obj.name != "Entity") {
			obj = Object.getPrototypeOf(obj);
			path.push(obj.name);
		}
		return path.reverse();
	}

	/**
	 * Add an action to the plugin
	 * @param {String} _name
	 * @param {String} _script
	 * @param {String} _description
	 * @param {Function} _function
	 */
	addAction (_name, _script, _description, _function) {
		let action = {
			name       : _name,
			script     : _script,
			description: _description,
			function   : _function
		};
		this.actions.push(action);
	}

	/**
	 * Add an expression to the plugin
	 * @param {String} _name
	 * @param {String} _script
	 * @param {String} _description
	 */
	addExpression (_name, _script, _description) {
		let expression = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.expressions.push(expression);
	}

	/**
	 * Add a condition to the plugin
	 * @param {String} _name
	 * @param {String} _script
	 * @param {String} _description
	 */
	addCondition (_name, _script, _description) {
		let condition = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.conditions.push(condition);
	}

	/**
	 * Show all ACEs of the plugin
	 */
	dump () {
		console.log(this.name + " : " + this.type);
		console.log("\tActions", this.actions);
		console.log("\tConditions", this.conditions);
		console.log("\tExpressions", this.expressions);
	}

	/**
	 * Function runned on plugin load
	 */
	load () {
		this.instanciable = false;
	}
};