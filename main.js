let electron      = require('electron');
let app           = electron.app;
let BrowserWindow = electron.BrowserWindow;


const path = require('path');
const url  = require('url');

let mainWindow;

function createWindow() {
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

	//mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('browser-window-created', function (e, window) {
	window.setMenu(null);
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
});
