'use strict';

let gulp     = require('gulp');
let electron = require('electron-connect').server.create();

gulp.task('serve', function () {
	electron.start();
	gulp.watch('main.js', electron.restart);
	gulp.watch(['renderer.js', 'layout/*.html', 'index.html', "style/*.css"], electron.reload);
});