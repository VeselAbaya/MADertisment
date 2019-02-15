const electron = require('electron')
const fs = require('fs')

const {app, BrowserWindow, ipcMain} = electron

const paths = {
    auth: `file://${__dirname}/auth-form/auth-form.html`,
    adPlatformSelector: `file://${__dirname}/ad-platforms-selector/ad-platforms-selector.html`,
    adTypeSelector: `file://${__dirname}/ad-type-selector/ad-type-selector.html`,
    publishing: `file://${__dirname}/publishing/publishing.html`,
    adForm: `file://${__dirname}/ad-form/ad-form.html`,
    data: './app/data/',
    dataUser: './app/data/user.json',
    dataAuth: './app/data/auth-data.json',
}

let prevPagePath = ''

let mainWindow
let sessionData
let typeId
let platformsData
app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })
    mainWindow.loadURL(paths.auth)

    ipcMain.on('auth:success', (event, userData) => {
        if (!fs.existsSync(paths.data))
            fs.mkdirSync(paths.data)

        fs.writeFile(paths.dataUser, JSON.stringify(userData, null, '\t'), (err) => {
            // TODO maybe some handle???
        })

        prevPagePath = paths.auth
        mainWindow.loadURL(paths.adTypeSelector)
    })

    ipcMain.on('adTypeSelector:typeSelected', (event, data) => {
        prevPagePath = paths.adTypeSelector

        typeId = data.typeId
        sessionData = {
            id: data.session.id,
            token: data.session.token
        }

        mainWindow.loadURL(paths.adPlatformSelector)
    })

    ipcMain.on('adPlatformSelector:error', () => {
        // TODO if (prevPagePath === paths.auth) kill process
        mainWindow.loadURL(prevPagePath)
    })

    ipcMain.on('request:data', () => {
        let userData
        if (fs.existsSync(paths.dataUser))
            userData = JSON.parse(fs.readFileSync(paths.dataUser).toString() || '""')

        let authData
        if (fs.existsSync(paths.dataAuth))
            authData = JSON.parse(fs.readFileSync(paths.dataAuth).toString() || '""')

        mainWindow.webContents.send('response:data', {
            user: userData || {},
            auth: authData || [],
            session: sessionData || {},
            platforms: platformsData || {},
            typeId: typeId
        })
    })

    ipcMain.on('authData:save', (event, authDataArray) => {
        if (!fs.existsSync(paths.data))
            fs.mkdirSync(paths.data)

        fs.writeFile(paths.auth, JSON.stringify(authDataArray, null, '\t'), (err) => {
            // TODO maybe some handle???
        })
    })

    ipcMain.on('authData:remove', (event, platformId) => {
        if (fs.existsSync(paths.auth)) {
            const authDataArray =
              JSON.parse(fs.readFileSync(paths.auth).toString() || '""')

            const removeIndex = authDataArray.findIndex(authData => authData.id === platformId)
            authDataArray.splice(removeIndex, 1)

            fs.writeFile(paths.auth, JSON.stringify(authDataArray, null, '\t'), (err) => {
                // TODO maybe some handle???
            })
        }
    })

    ipcMain.on('adPlatformsSelector:submit', (event, data) => {
        platformsData = data
        mainWindow.loadURL(paths.adForm)
    })
})
