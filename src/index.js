// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, ipcRenderer } = require('electron');
const { ipcMain } = require('electron');
const path = require('path');
var validUrl = require('valid-url');

var pages = [];

var view = undefined;
var oldUrl = undefined;
var mainWindow = undefined;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + "/../resources/icon.png",
    title: "Electik Web Browser"
  })

  // and load the index.html of the app.
  mainWindow.loadFile('render/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  view = new BrowserView();
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
  view.webContents.loadURL('http://192.168.1.103/?p=1')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });

  ipcMain.on('resize', (event, x, y, height, width) => {
    view.setBounds({ x, y, width, height });
  })
  ipcMain.on('showurl', (event, url) => {
    view.webContents.loadURL(url);
  })
  view.webContents.executeJavaScript(`window.eval = function(){
    console.log('%c[BROWSER.IO] Finded use eval! Eval is blocked', 'background: #222; color: #bada55');
    return new Error("Eval is blocked in BROWSER.IO")
  }`);

})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

setInterval(function(){
  if(view.webContents.getURL() != oldUrl){
    mainWindow.webContents.send("seturl", String(view.webContents.getURL()));

    oldUrl = view.webContents.getURL();
    console.log(view.webContents.getURL());
  }

}, 100)


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.