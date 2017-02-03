const moment = require("moment");

module.exports = class Console {
	constructor() {
		this.element = "console";
	}

	say(text, color="white")
	{
		let dateTime = moment().format("HH:mm:ss");

		let output = `<span style="color: grey;">[${dateTime}]</span> <span style="color: ${color};">${text}</span>`;
		$("#" + this.element).append(`${output}<br>`);
		console.log(output);
	}
};