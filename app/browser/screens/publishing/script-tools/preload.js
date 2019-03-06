const {ipcRenderer} = require('electron')
const {Queue, simulateMouseClick, callWithMinCallbackDelay} = require('./core/core')



ipcRenderer.on('webview_did-finish-load', (event, data) => {
  console.log("webview_did-finish-load")
})

ipcRenderer.on('fill-form', (event, data) => {
  queryes = data.queryes
  queue = new Queue()
  queryes.forEach((query, index) =>  {
    queue.addAction(callWithMinCallbackDelay.bind(this, function (callback) {
      elem = document.querySelector(query["selector"]);
      if (elem == null) {
        console.error(query)
        let checkExistInterval = setInterval(function() {
          elem = document.querySelector(query["selector"]);

          if (elem) {
            console.log(query)
            actionDict[query["type"]](elem,query,callback)
            clearInterval(checkExistInterval);
          } else {
            console.error(query)
          }
        }, 10);
        // console.error("undefined selector:", query)
        // callback()
      } else {
        console.log(query)
        actionDict[query["type"]](elem,query,callback)
      }

    }, 0))

  })
  queue.dispatchNext(()=>{
    ipcRenderer.sendToHost("ipc-event",{callback_channel:data.callback_channel})
  })
})

actionDict = {

  "click": function(elem, action, callback = ()=>{}) {
    elem.focus();
    if (elem.disabled === true){ //TODO: STUPID PLS DO ADEKVATE CODE
      setTimeout(()=>{simulateMouseClick(elem, callback)}, 500)
    } else {
      simulateMouseClick(elem, callback);
    }
  },

  "react-pick": function(elem, action, callback = ()=>{}) {
    elem.focus()
    simulateMouseClick(elem, ()=>{
      item = document.querySelector(action["item"]["selector"] + ":nth-of-type("+action["item"]["item-number"]+")")
      simulateMouseClick(item, callback);
    });
  },

  "value": function(elem, action, callback = ()=>{}) {
    elem.focus();
    document.execCommand('insertText', false, action.value)
    callback()
    // let callback_channel = Math.random().toString(36)
    // ipcRenderer.sendToHost("input-text", {selector:action.selector, value:action.value, callback_channel: callback_channel});
    // ipcRenderer.once(callback_channel, (event) =>{
    //   callback();
    // })
  },

  "checkbox": function(elem, action, callback = ()=>{}) {
    elem.focus();
    if (action["checked"]){
      simulateMouseClick(elem, callback);
    } else {
      callback();
    }
  },

  "file": function(elem, action, callback = ()=>{}) {
    elem.focus()
    let callback_channel = Math.random().toString(36)
    ipcRenderer.sendToHost("input-file", {selector:action.selector, value:action.value, callback_channel: callback_channel})
    ipcRenderer.once(callback_channel, (event) =>{
      callback();
    })
  },

  "native-pick": function(elem, action, callback = ()=>{}) {
    elem.focus()
    let callback_channel = Math.random().toString(36)
    ipcRenderer.sendToHost("input-text", {selector:action.selector, value:action.value, callback_channel: callback_channel});
    ipcRenderer.once(callback_channel, (event) =>{
      callback();
    })
  },

}
