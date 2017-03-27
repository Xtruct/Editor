/**
 * Created by Armaldio on 23/03/2017.
 */

const Mustache = require("mustache");

/**
 * Modal management
 * @type {Modal}
 */
module.exports = class Modal {
	constructor (options) {
		this.options = options;

		if (this.options.close === undefined)
			this.options.close = true;

		this.template = `
		<div id="modal-template" class="modal">
    		<div class="modal-content">
    			<h1>{{ title }}</h1>
    		    <p>{{ message }}</p>
    		</div>
		
    		<div class="modal-footer">
    		    {{ #buttons }}
    		    	<a data-id="{{ id }}" id="" class="modal-action {{ #close }}modal-close{{ /close }} waves-effect waves-green btn-flat white-text">{{ name }}</a>
    		    {{ /buttons }}
    		</div>
		</div>
`
	}

	show () {
		let rendered = Mustache.render(this.template, this.options);

		//console.log(rendered);

		//Add the modal tot he DOM
		$(document.body).append(rendered);

		//Set up modal
		$('#modal-template').modal({
			dismissible: false,
			opacity    : .5,
			ready      : function (modal, trigger) {
				//Don't know what to put here
			},
			complete   : function () {
				$('#modal-template').remove();
			}
		});

		//For each defined button
		$.each(this.options.buttons, (index, value) => {

			//When you click on the button
			$(`#modal-template .modal-action[data-id="${value.id}"]`).on("click", () => {

				//Call the callback function
				value.func();
			});
		});

		$('#modal-template').modal('open');
	}
};