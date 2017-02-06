/**
 * Created by Armaldio on 06/02/2017.
 */

module.exports = class Entity {
	constructor(name) {
		this.name        = name;
		this.actions     = {};
		this.conditions  = {};
		this.expressions = {};

	}

	addAction(_name, _script, _description) {
		let action = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.actions.push(action);
	}

	addExpression(_name, _script, _description) {
		let expression = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.expressions.push(expression);
	}

	addCondition(_name, _script, _description) {
		let condition = {
			name       : _name,
			script     : _script,
			description: _description
		};
		this.conditions.push(condition);
	}

	dump()
	{
		console.log("Actions", this.actions);
		console.log("Conditions", this.conditions);
		console.log("Expressions", this.expressions);
	}
};