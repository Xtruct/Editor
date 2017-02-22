/**
 * Created by Armaldio on 06/02/2017.
 */

module.exports = class Entity {
	constructor (name = "Entity", type = "entity") {
		this.name         = name;
		this.type         = type;
		this.actions      = [];
		this.conditions   = [];
		this.expressions  = [];
		this.instanciable = true;

		console.log(this.name + " - " + this.type + " loaded");

	}

	addAction (_name, _script, _description, _function) {
		let action = {
			name       : _name,
			script     : _script,
			description: _description,
			function   : _function
		};
		this.actions.push(action);
	}

	addExpression (_name, _script, _description) {
		let expression = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.expressions.push(expression);
	}

	addCondition (_name, _script, _description) {
		let condition = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.conditions.push(condition);
	}

	dump () {
		console.log(this.name + " : " + this.type);
		console.log("\tActions", this.actions);
		console.log("\tConditions", this.conditions);
		console.log("\tExpressions", this.expressions);
	}

	load () {
		this.instanciable = false;
	}
};