import {ipcRenderer} from 'electron'
import {StagesBar} from '../StagesBar/StagesBar'
import {WebviewWrapper} from '../../script-tools/renderer'

export class PublishView {
  constructor(options) {
    this.stagesBar = new StagesBar(options);
    this.webview = document.querySelector('webview');
    this.webviewWrapper = new WebviewWrapper(this.webview, ipcRenderer, './script-tools/preload.js');
    this.webview.src = this.stagesBar.currentURL
  }

  nextStage() {
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    if (this.stagesBar.currentStageIndex < stages.length) {
      const actions = stages[this.stagesBar.currentStageIndex].actions;
      console.log(actions);
      this.webviewWrapper.performActions(actions)
    }

    ipcRenderer.send('clearSession');
    return this.stagesBar.nextStage()
  }

  nextURL() {
    this.stagesBar.nextURL();

    this.webview.src = this.stagesBar.currentURL; // in webviewWrapper changes too
    this.webview.addEventListener('did-stop-loading', () => {
      this.nextStage()
    }, {once: true});
  }
}