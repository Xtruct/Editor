'use strict';

let gulp     = require('gulp');
let electron = require('electron-connect').server.create();

gulp.task('serve', function () {
	electron.start();
	gulp.watch('main.js', electron.restart);

	//TODO move on to scss to use material variables from materializecss
	gulp.watch(['renderer.js', 'layout/*.html', 'index.html', 'testfile.html', "style/**/*.css"], electron.reload);
});