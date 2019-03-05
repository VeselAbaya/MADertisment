const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');

    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path);
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

const parseDataFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return {};
  }
};

module.exports = Store;