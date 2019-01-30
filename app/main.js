const electron = require('electron')
const fs = require('fs')

const {app, BrowserWindow, ipcMain} = electron

let mainWindow
app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })
    mainWindow.loadURL(`file://${__dirname}/auth-form/auth-form.html`)
    // mainWindow.loadURL(`file://${__dirname}/ad-platforms-selector/ad-platforms-selector.html`)

    ipcMain.on('auth:success', (event, userData) => {
        if (!fs.existsSync('./app/data'))
            fs.mkdirSync('./app/data')

        fs.writeFile('./app/data/user.json', JSON.stringify(userData, null, '\t'), (err) => {
            // TODO maybe some handle???
        })
        mainWindow.loadURL(`file://${__dirname}/ad-platforms-selector/ad-platforms-selector.html`)
    })

    ipcMain.on('adPlatformSelector:error', () => {
        mainWindow.loadURL(`file://${__dirname}/auth-form/auth-form.html`)
    })

    ipcMain.on('request:data', () => {
        let userData
        if (fs.existsSync('./app/data/user.json'))
            userData = JSON.parse(fs.readFileSync('./app/data/user.json').toString() || '""')

        let authData
        if (fs.existsSync('./app/data/auth-data.json'))
            authData = JSON.parse(fs.readFileSync('./app/data/auth-data.json').toString() || '""')

        mainWindow.webContents.send('response:data', {
            user: userData || {},
            auth: authData || []
        })
    })

    ipcMain.on('authData:save', (event, authDataArray) => {
        if (!fs.existsSync('./app/data'))
            fs.mkdirSync('./app/data')

        fs.writeFile('./app/data/auth-data.json', JSON.stringify(authDataArray, null, '\t'), (err) => {
            // TODO maybe some handle???
        })
    })
})
