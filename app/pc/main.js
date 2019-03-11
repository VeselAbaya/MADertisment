const electron = require('electron');
const fs = require('fs');
const Store = require('./Store/Store');

const {app, BrowserWindow, ipcMain, session} = electron;

const paths = {
  auth: `file://${__dirname}/../browser/screens/auth-form/auth-form.screen.html`,
  adPlatformSelector: `file://${__dirname}/../browser/screens/ad-platforms-selector/ad-platforms-selector.screen.html`,
  adTypeSelector: `file://${__dirname}/../browser/screens/ad-type-selector/ad-type-selector.screen.html`,
  publishing: `file://${__dirname}/../browser/screens/publishing/publishing.screen.html`,
  adForm: `file://${__dirname}/../browser/screens/ad-form/ad-form.screen.html`,
  data: './app/data/',
  dataUser: './app/data/user.json',
  dataAuth: './app/data/auth-data.json',
};

const store = new Store({
  configName: 'user-auth-platforms'
});

let prevPagePath = '';

let mainWindow;
let sessionData;
let typeId;
let platformsData;
app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 1200, height: 900});
  mainWindow.loadURL(paths.auth);

  mainWindow.on('close', () => {
    session.defaultSession.clearStorageData();
    app.quit()
  });

  ipcMain.on('auth:success', (event, userData) => {
    if (!fs.existsSync(paths.data))
      fs.mkdirSync(paths.data);

    fs.writeFile(paths.dataUser, JSON.stringify(userData, null, '\t'), (err) => {
      // TODO maybe some handle???
    });

    prevPagePath = paths.auth;
    mainWindow.loadURL(paths.adTypeSelector)
  });

  ipcMain.on('adTypeSelector:typeSelected', (event, data) => {
    prevPagePath = paths.adTypeSelector;

    typeId = data.typeId;
    sessionData = {
      id: data.session.id,
      token: data.session.token
    };

    mainWindow.loadURL(paths.adPlatformSelector)
  });

  ipcMain.on('adPlatformSelector:error', () => {
    // TODO if (prevPagePath === paths.auth) kill process
    mainWindow.loadURL(prevPagePath)
  });

  ipcMain.on('request:data', () => {
    let userData;
    if (fs.existsSync(paths.dataUser)) {
      userData = JSON.parse(fs.readFileSync(paths.dataUser).toString() || '""');
    }

    mainWindow.webContents.send('response:data', {
      user: userData || {},
      session: sessionData || {},
      platforms: platformsData || {},
      typeId: typeId
    })
  });

  ipcMain.on('adPlatformsSelector:submit', (event, data) => {
    platformsData = data;
    mainWindow.loadURL(paths.adForm)
  });

  ipcMain.on('adForm:submit', () => {
    mainWindow.loadURL(paths.publishing)
  });

  ipcMain.on('adPlatformsSelector:authDataSave', (event, data) => {
    store.set('auth_data_' + data.id + "_" + data.fieldName, data.value);
  });

  ipcMain.on('adPlatformsSelector:authDataRequest', (event) => {
    mainWindow.webContents.send('adPlatformsSelector:authDataResponse', store)
  });
});
