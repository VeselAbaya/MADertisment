class Debugger{
  constructor(_debugger){
    _debugger.attach("1.1");
    this.debugger = _debugger
  }

  attach(){
    this.debugger.attach("1.1");
  }

  detach(){
    if (this.debugger){
      this.debugger.detach();
    }
  }

  getDocument(callback = ()=>{}) {
    this.debugger.sendCommand("DOM.getDocument", {}, callback)
  };

  qSelector(selector, callback = ()=>{}) {
    this.getDocument((err,res) => {
      this.debugger.sendCommand("DOM.querySelector",
        {
          nodeId: res.root.nodeId,
          selector: selector
        },
        callback
      )
    })
  }

 focus(selector, callback = ()=>{}) {
    this.qSelector(selector, (err,res)=>{
      this.debugger.sendCommand("DOM.focus",
        {nodeId: res.nodeId,},
        callback
      )
    })
  }

  typeChar(char, callback = ()=>{}) {
    this.debugger.sendCommand("Input.dispatchKeyEvent", { type: 'char', text: char }, callback)
  }

  uploadFile(selector, filePath, callback = ()=>{}){
    if (!Array.isArray(filePath)){
      filePath = [filePath]
    }

    this.qSelector(selector, (err, res) => {
      this.debugger.sendCommand("DOM.setFileInputFiles", {
        nodeId: res.nodeId,
        files: filePath // Actual list of paths
      }, function (err, res) {
        callback(err, res)
      });
    })
  }
}

class Queue{
  constructor(){
    this.actions = [];
  }

  dispatchNext(callback = ()=>{}){
    let action = this.actions.shift()
    if (action){
      action(this.dispatchNext.bind(this, callback))
    } else
      callback()
  }

  addAction(action){
    this.actions.push(action)
  }
}

EventTarget.prototype.addEventListenerRunOnce = function(name, callback) {
  const eventWrapper = (event) => {
    this.removeEventListener(name, eventWrapper);
    callback(event);
  };

  this.addEventListener(name, eventWrapper);
};

function simulateMouseClick(element, callback = ()=>{}){
  const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      })
    )
  );
  callback();
}

function callWithMinCallbackDelay(func, timeout, callback) {
  let someoneDone = false
  function doneHandler() {
    if (someoneDone){
      callback();
    } else {
      someoneDone = true;
    }
  }
  setTimeout(doneHandler, timeout);
  func(doneHandler)
}

class WebviewWrapper extends EventTarget{
  constructor(webview, ipcRenderer, preload){
    super()

    this.webview = webview
    this.webview.preload = preload
    this.ipcRenderer = ipcRenderer
    this.webview.addEventListener('did-start-loading', this.loadstart.bind(this))
    this.webview.addEventListenerRunOnce('did-finish-load', this.loadstoponce.bind(this))
    this.webview.addEventListener("ipc-message", this.ipcMessage.bind(this))
    this.deburgger = null


  }
  performActions(actionList, callback){
    this.ipcRenderer.send("focus")
    this.webview.focus()
    actionList.callback_channel = Math.random().toString(36);
    this.webview.send('fill-form', actionList)
    this.addEventListenerRunOnce(actionList.callback_channel, callback)

  }

  loadstart(){
    //To avoid blinking debugger between page loading
    if (this.deburgger){
      this.deburgger.detach()
    }
  }

  loadstop(){
    //To avoid blinking debugger between page loading
    this.deburgger.attach()
  }

  loadstoponce(){
    console.log(this.webview)
    this.webview.getWebContents().openDevTools()
    var wc = this.webview.getWebContents()
    this.deburgger = new Debugger(wc.debugger)
    this.webview.addEventListener('did-finish-load', this.loadstop.bind(this))
    this.webview.send('webview_did-finish-load')
  }

  loadUrl(url, callback = ()=>{}){
    if (url == ''){
      callback()
    } else {
      this.webview.src = url;
      this.webview.addEventListenerRunOnce('did-finish-load', ()=>{
        callback()
      })
    }
  }

  ipcMessage(event){
    //console.log(event)
    var data = event.args[0]
    switch (event.channel) {
      case "input-text":
        this.input_text(data.selector, data.value, data.callback_channel)
        break;
      case "input-file":
        this.input_file(data.selector, data.value, data.callback_channel)
        break;
      case "ipc-event":
        this.dispatchEvent(new Event(data.callback_channel))
      default:
        break;
    }
  }

  input_text(selector, text, callback_channel) {
    text = text.toString()
    this.ipcRenderer.send("focus")//Still not sure bout this
    this.webview.focus()
    this.deburgger.focus(selector, (err, res) => {
      let queue = new Queue()
      for (var i = 0; i < text.length; i++) {
        queue.addAction(
          this.deburgger.typeChar.bind(this.deburgger,text[i])
        )
      }
      queue.dispatchNext(()=>{this.webview.send(callback_channel)})
    })
  }

  input_file(selector, paths, callback_channel) {
    this.deburgger.uploadFile(selector,paths,()=>{
      this.webview.send(callback_channel)
    })
  }
};

module.exports = {Debugger, Queue, WebviewWrapper, callWithMinCallbackDelay, simulateMouseClick}
