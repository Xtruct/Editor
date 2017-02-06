const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev         = require('electron-is-dev');

const path = require('path');
const url  = require('url');

let mainWindow;

app.commandLine.appendSwitch('force-device-scale-factor', '1');

function createWindow() {
	let screen = electron.screen;

	const {width, height} = screen.getPrimaryDisplay().workAreaSize;
	mainWindow            = new BrowserWindow({
		title          : "Xtruct Editor",
		protocol       : 'file:',
		slashes        : true,
		icon           : path.join(__dirname, 'build/icon.ico'),
		backgroundColor: '#2e2c29',
		width          : width,
		height         : height
	});

	mainWindow.loadURL(url.format(path.join(__dirname, 'index.html')));

	mainWindow.setMenu(null);

	mainWindow.maximize();

	mainWindow.webContents.openDevTools();

	if (isDev) {
		console.log('Running in development');
		//let client        = require('electron-connect').client;
		//client.create(mainWindow);
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
