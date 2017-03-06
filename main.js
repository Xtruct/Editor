const electron       = require('electron');
const app            = electron.app;
const BrowserWindow  = electron.BrowserWindow;
const isDev          = require('electron-is-dev');
const fs             = require('fs');
const VersionManager = require('./modules/versionManager.js');

global.req  = require('app-root-path').require;
global.ROOT = require('app-root-path');

const path = require('path');
const url  = require('url');

let mainWindow;

app.commandLine.appendSwitch('--force-device-scale-factor', '1');
app.commandLine.appendSwitch('--disable-gpu');

app.setAppUserModelId("com.editor.xtruct");

function createWindow () {

	let screen = electron.screen;

	const {width, height} = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		title          : "Xtruct Editor",
		icon           : path.join(__dirname, 'build/icon.ico'),
		backgroundColor: '#2e2c29',
		width          : width,
		height         : height
	});

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes : true
	}));

	mainWindow.setMenu(null);

	mainWindow.maximize();

	process.argv.forEach(function (value) {
		console.log(value);
		if (value === "-dev") mainWindow.webContents.openDevTools();
	});

	if (isDev) {
		mainWindow.webContents.openDevTools();
		console.log('Running in development');
	} else {
		console.log('Running in production');
	}

	mainWindow.on('closed', function () {
		mainWindow = null;
		app.quit();
	});
}

app.on('browser-window-created', function (e, window) {
	window.setMenu(null);
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	//if (process.platform !== 'darwin') {
	app.quit();
	//}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
