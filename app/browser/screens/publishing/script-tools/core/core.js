const Debugger = function (_debugger) {
  _debugger.attach('1.1');
  this.debugger = _debugger;

  this.getDocument = function (callback = () => {
  }) {
    this.debugger.sendCommand('DOM.getDocument', {}, callback)
  };

  this.qSelector = function (selector, callback = () => {
  }) {
    this.getDocument((err, res) => {
      this.debugger.sendCommand('DOM.querySelector',
        {
          nodeId: res.root.nodeId,
          selector: selector
        },
        callback
      )
    })
  };

  this.focus = function (selector, callback = () => {
  }) {
    this.qSelector(selector, (err, res) => {
      this.debugger.sendCommand('DOM.focus',
        {nodeId: res.nodeId,},
        callback
      )
    })
  };

  this.typeChar = function (char, callback = () => {
  }) {
    this.debugger.sendCommand('Input.dispatchKeyEvent', {type: 'char', text: char}, callback)
  };

  this.uploadFile = function (selector, filePath, callback = () => {
  }) {
    if (!Array.isArray(filePath)) {
      filePath = [filePath]
    }

    this.qSelector(selector, (err, res) => {
      this.debugger.sendCommand('DOM.setFileInputFiles', {
        nodeId: res.nodeId,
        files: filePath // Actual list of paths
      }, function (err, res) {
        callback(err, res)
      });
    })
  }
};
//
// this.Debugger = Debugger

const WebviewWrapper = class {
  constructor(webview, ipcRenderer, preload) {
    this.webview = webview;
    this.webview.preload = preload;
    this.ipcRenderer = ipcRenderer;
    this.webview.addEventListener('did-start-loading', this.loadstart.bind(this));
    this.webview.addEventListener('did-finish-load', this.loadstop.bind(this));
    this.webview.addEventListener('ipc-message', this.ipcMessage.bind(this));
    this.deburgger = null


  }

  perfomActions(actionList) {
    this.ipcRenderer.send('focus');
    this.webview.focus();
    this.webview.send('fill-form', actionList)
  }

  loadstart() {

  }

  loadstop() {
    console.log(this.webview);
    this.webview.getWebContents().openDevTools();
    var wc = this.webview.getWebContents();
    console.log(window);
    this.deburgger = new Debugger(wc.debugger);
    this.webview.send('webview_did-finish-load')
  }

  ipcMessage(event) {
    data = event.args[0];
    switch (event.channel) {
      case 'input-text':
        this.input_text(data.selector, data.value);
        break;
      case 'input-file':
        this.input_file(data.selector, data.value);
        break;
      default:
        break;
    }
  }

  input_text(selector, text) {
    this.ipcRenderer.send('focus');//Still not sure bout this
    this.webview.focus();
    this.deburgger.focus(selector, (err, res) => {
      for (var i = 0; i < text.length; i++) {
        this.deburgger.typeChar(text[i])
      }
    })
  }

  input_file(selector, paths) {
    this.deburgger.uploadFile(selector, paths)
  }
};
