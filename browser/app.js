var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
	if(process.platform !== 'darwin') {
		app.quit();
	} 
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 1200, height: 800});
	
});