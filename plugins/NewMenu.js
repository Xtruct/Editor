module.exports = class NewMenu extends Editor {
	constructor () {
		super()

	}

	init () {

		let menu = this.addMenu("NewMenu");

		menu.addSubmenu("Sub1", sub1);
		menu.addSubmenu("Sub2", sub2);
		menu.addSubmenu("Sub3", sub3);

		$("#newproject-item").on("click", () => {
			$('#newProjectModal').modal('open');
		});
	}

	setup () {

	}

	load () {

	}
};