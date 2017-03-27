global.ROOT = require('app-root-path');
global.x    = require("./core/x.js");

//Node modules
const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev         = require('electron-is-dev');
const fs            = require('fs');
const path          = require('path');
const url           = require('url');

const x       = require("./core/x");
const Updater = x.require("core.Updater", true);

//Globals
global.req  = require('app-root-path').require;
global.ROOT = require('app-root-path');

//core modules
const VersionManager = x.require("core.VersionManager");

let mainWindow;

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

	//Disable menu
	mainWindow.setMenu(null);

	mainWindow.maximize();

	//TODO use @yarg to parse args
	process.argv.forEach(function (value) {
		console.log(value);
		if (value === "-dev")
			mainWindow.webContents.openDevTools();
	});

	if (isDev) {
		mainWindow.webContents.openDevTools();
		console.log('Running in development');
	} else {
		console.log('Running in production');
	}

	//When user click on close, exit
	mainWindow.on('closed', function () {
		mainWindow = null;
		app.quit();
	});
}

//When any new window open, diable menu
app.on('browser-window-created', function (e, window) {
	window.setMenu(null);
});

app.on('ready', () => {
	Updater.checkForUpdates().then((update) => {
		if (update)
			//Ask if he wants to update
			console.log("Do you want to update ?");
		else
			console.log("Sorry no updates");
	}).catch((err) => {
		console.log(`Error while updating : ${err}`);
	});

	createWindow();
})
;

app.on('window-all-closed', function () {
	app.quit();
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
