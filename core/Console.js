const moment = require("moment");

module.exports = class Console {
	constructor () {
	}

	static say (text, color = "white") {
		let dateTime = moment().format("HH:mm:ss");

		let output = `<span style="color: grey;">[${dateTime}]</span> <span style="color: ${color};">${text}</span>`;
		$("#editorconsole").append(`${output}<br>`);
		console.log(`[${dateTime}] ${text}`);
	}
};