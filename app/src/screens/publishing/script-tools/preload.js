const {ipcRenderer} = require('electron');
const {palette} = require('./core/core');


ipcRenderer.on('webview_did-finish-load', (event, data) => {
  //console.log("lol")
});

ipcRenderer.on('fill-form', (event, data) => {
  queryes = data;

  queryes.forEach((query, index) => {
    setTimeout(function () {
      elem = document.querySelector(query['selector']);
      if (elem == null) {
        console.error(query)
      } else {
        switch (query['type']) {
          case 'click':
            elem.focus();
            simulateMouseClick(elem);
            break;
          case 'value':
            elem.focus();
            ipcRenderer.sendToHost('input-text', {selector: query.selector, value: query.value});
            break;
          case 'checkbox':
            if (query['checked']) {
              simulateMouseClick(elem)
            }
            break;
          case 'file':
            ipcRenderer.sendToHost('input-file', {selector: query.selector, value: query.value});
            break;
        }
      }
    }, index * 600);
  })
});


const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

function simulateMouseClick(element, callback) {
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
}
