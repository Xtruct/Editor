console.log("a");

let electron      = require('electron');
let app           = electron.app;
let BrowserWindow = electron.BrowserWindow;
const isDev       = require('electron-is-dev');

const path = require('path');
const url  = require('url');

let mainWindow;

console.log("1");

function createWindow() {
	console.log("2");
	let screen = electron.screen;

	const {width, height} = screen.getPrimaryDisplay().workAreaSize;
	mainWindow            = new BrowserWindow({width, height});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes : true
	}));


	mainWindow.setMenu(null);

	mainWindow.maximize();

	if (isDev) {
		console.log('Running in development');
		mainWindow.webContents.openDevTools();

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
