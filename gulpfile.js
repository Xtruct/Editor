'use strict';

let gulpDocumentation = require('gulp-documentation');
let gulp     = require('gulp');
let electron = require('electron-connect').server.create();
let fs       = require("fs");

gulp.task('serve', function () {
	electron.start();

	gulp.watch('main.js', electron.restart);

	gulp.watch(['renderer.js', 'layout/*.html', 'index.html', 'testfile.html'], electron.reload);

	gulp.watch(["./style/*.css"], console.log("Reload"));
});

gulp.task('doc', function () {
	let core = fs.readdirSync("core");
	let files = "\"" + core.join("\", \"") + "\"";

	let exec = require('child_process').exec;
	let cmd = 'documentation build ' + files + ' -f html -o docs/core';

	exec(cmd, function(error, stdout, stderr) {
		console.log(error, stdout, stderr);
		console.log("Documentation done");
	});

});

gulp.task('plugins', function () {
	let core = fs.readdirSync("plugins");
	let files = "\"" + core.join("\", \"") + "\"";

	let exec = require('child_process').exec;
	let cmd = 'documentation build ' + files + ' -f html -o docs/plugins';

	exec(cmd, function(error, stdout, stderr) {
		console.log(error, stdout, stderr);
		console.log("Documentation done");
	});
});