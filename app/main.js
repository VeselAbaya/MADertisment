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

        let standardPlatformsIds
        if (fs.existsSync('./app/data/standard-platforms-ids.json'))
            standardPlatformsIds =
              JSON.parse(fs.readFileSync('./app/data/standard-platforms-ids.json').toString() || '""')

        mainWindow.webContents.send('response:data', {
            user: userData || {},
            auth: authData || [],
            standardPlatformsIds: standardPlatformsIds || []
        })
    })

    ipcMain.on('authData:save', (event, authDataArray) => {
        if (!fs.existsSync('./app/data'))
            fs.mkdirSync('./app/data')

        fs.writeFile('./app/data/auth-data.json', JSON.stringify(authDataArray, null, '\t'), (err) => {
            // TODO maybe some handle???
        })
    })

    ipcMain.on('authData:remove', (event, platformId) => {
        if (fs.existsSync('./app/data/auth-data.json')) {
            const authDataArray =
              JSON.parse(fs.readFileSync('./app/data/auth-data.json').toString() || '""')

            const removeIndex = authDataArray.findIndex(authData => authData.id === platformId)
            authDataArray.splice(removeIndex, 1)

            fs.writeFile('./app/data/auth-data.json', JSON.stringify(authDataArray, null, '\t'), (err) => {
                // TODO maybe some handle???
            })
        }
    })

    ipcMain.on('standardPlatformsIds:save', (event, standardPlatformsIds) => {
        fs.writeFile('./app/data/standard-platforms-ids.json',
                     JSON.stringify(standardPlatformsIds), (err) => {
            // TODO maybe some handle???
        })
    })

    ipcMain.on('adPlatformsSelector:submit', (event, selectedPlatformsIds) => {
        // TODO go to form
    })
})
