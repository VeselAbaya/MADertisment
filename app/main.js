const electron = require('electron')

const {app, BrowserWindow, ipcMain} = electron

let mainWindow
let token
app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })
    mainWindow.loadURL(`file://${__dirname}/auth-form/auth-form.html`)
    // mainWindow.loadURL(`file://${__dirname}/ad-platforms-selector/ad-platforms-selector.html`)

    ipcMain.on('auth:success', (event, tokenArg) => {
        token = tokenArg
        mainWindow.loadURL(`file://${__dirname}/ad-platforms-selector/ad-platforms-selector.html`)
    })

    ipcMain.on('adPlatformSelector:error', () => {
        mainWindow.loadURL(`file://${__dirname}/auth-form/auth-form.html`)
    })
})
