const moment = require("moment");

class BaseConsole {
	constructor(element) {
		this.element = element;
	}

	say(text, color = "white") {
		let dateTime = moment().format("HH:mm:ss");

		let output = `<span style="color: grey;">[${dateTime}]</span> <span style="color: ${color};">${text}</span>`;
		$("#" + this.element).append(`${output}<br>`);
		console.log(`[${dateTime}] ${text}`);
	}
}

class GameConsole extends BaseConsole {
	constructor() {
		super("gameconsole");
	}
}

class EditorConsole extends BaseConsole {
	constructor() {
		super("editorconsole");
	}
}

class RegularConsole {
	constructor () {
	}

	static say(msg, color = "black") {
		console.log(`%c ${msg}`, `color: ${color};`);
	}
}

module.exports = class Console {
	constructor() {
		this.game   = new GameConsole();
		this.editor = new EditorConsole();
		this.console = new RegularConsole();
	}
};