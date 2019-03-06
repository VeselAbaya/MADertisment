const {ipcRenderer} = require('electron')
const {Debugger, WebviewWrapper, Queue} = require('./core/core')
const ya_input = require('./input_mock/yandex')
const avito_input = require('./input_mock/avito')

EventTarget.prototype.addEventListenerRunOnce = function(name, callback) {
  const eventWrapper = (event) => {
    this.removeEventListener(name, eventWrapper);
    callback(event);
  };

  this.addEventListener(name, eventWrapper);
};

onload = () => {

  const webview = document.querySelector('#wv')
  //webview.preload = "preload-mlsn.js"

  //webview.src = "https://spb.mlsn.ru/office/sale/edit/"
  //webview.src = "https://realty.yandex.ru/management-new/add/"
  //webview.src = "https://www.avito.ru/additem"
  webviewWrapper = new WebviewWrapper(webview, ipcRenderer,  "preload.js")



  const indicator = document.querySelector('#indicator')

  var i = 0;
  document.querySelector('#fill').addEventListener('click', () => {
    //var page = avito_input.full.data[i];
    var page = ya_input.full.data[i];
    console.log(page.url)
    webviewWrapper.loadUrl(page.url, ()=>{
      queue = new Queue()
      page.stages.forEach((stage, i) => {
        console.log(stage.actions)
        queue.addAction(
          webviewWrapper.perfomActions.bind(webviewWrapper, {queryes:stage.actions})
        )
      })
      queue.dispatchNext(()=>{console.log("page done")})
    })
    i++;
  });

  const loadstart = () => {
    indicator.innerText = 'loading...'
  }

  const loadstop = () => {
    indicator.innerText = 'loaded'
  }

  webview.addEventListener('did-start-loading', loadstart)
  webview.addEventListener('did-finish-load', loadstop)

}
