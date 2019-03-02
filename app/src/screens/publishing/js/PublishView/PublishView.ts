import {EventEmitter} from 'events'
import {ipcRenderer} from 'electron'
import {StagesBar} from '../StagesBar/StagesBar'
import {WebviewWrapper} from '../../script-tools/renderer.js';

export class PublishView extends EventEmitter {
  public stagesBar: StagesBar;
  public webview: any;
  private webviewWrapper: WebviewWrapper;

  constructor(options) {
    super();

    this.stagesBar = new StagesBar(options);
    this.webview = document.querySelector('webview');
    this.webviewWrapper = new WebviewWrapper(this.webview, ipcRenderer, './script-tools/preload.js');
    this.webview.src = this.stagesBar.currentURL;

    this.webview.addEventListener('did-finish-load', () => {
      this.emit('loaded');
    });
  }

  nextStage() {
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    if (this.stagesBar.currentStageIndex < stages.length) {
      const actions = stages[this.stagesBar.currentStageIndex].actions;
      this.webviewWrapper.performActions(actions);
    }

    return this.stagesBar.nextStage()
  }

  nextURL() {
    this.stagesBar.nextURL();

    this.webview.src = this.stagesBar.currentURL; // in webviewWrapper changes too
  }
}