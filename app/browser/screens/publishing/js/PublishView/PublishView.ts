import {EventEmitter} from 'events'
import {ipcRenderer} from 'electron'
import {StagesBar} from '../StagesBar/StagesBar'
import {WebviewWrapper} from '../../script-tools/core/core.js';

export class PublishView extends EventEmitter {
  public stagesBar: StagesBar;
  public webview: any;
  private webviewWrapper: WebviewWrapper;
  private onPause: boolean = false;

  constructor(options) {
    super();

    this.stagesBar = new StagesBar(options);
    this.webview = document.querySelector('webview');
    this.webviewWrapper = new WebviewWrapper(this.webview, ipcRenderer, './script-tools/preload.js');
    this.webviewWrapper.loadUrl(this.stagesBar.currentURL, ()=>{this.emit('loaded')} );

    this.webview.addEventListener('did-finish-load', () => {
      this.emit('loaded');
    })

    // this.emit('url-start-loading');
  }

  play() {
    const button = document.querySelector('#publish__screen-play-pause');
    button.innerHTML = "Пауза";

    this.onPause = false;

    const allStagesLength = this.currentStagesLength;
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    let stage = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length) - 1];
    if(stage !== undefined && stage.breakpoint === true) {
      this.stagesBar.removeBreakpointFor(stage);
    }

    this.nextStage();
  }

  pause() {
    const button = document.querySelector('#publish__screen-play-pause');
    button.innerHTML = "Продолжить";

    this.onPause = true;
  }

  get currentStagesLength() {
    let stagesLength = 0;
    for(let i = 0; i <= this.stagesBar.currentURLIndex; i++) {
      const stages = this.stagesBar.data[i].stages;
      stagesLength += stages.length;
    }

    return stagesLength;
  }

  isLastStage() {
    return this.stagesBar.currentStageIndex >= this.currentStagesLength - 1;
  }

  nextStage() {
    const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages;
    const allStagesLength = this.currentStagesLength;
    const stage = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length)];

    if(this.onPause) {
      return true;
    }

    if (this.stagesBar.currentStageIndex < allStagesLength) {
      const actions = stages[this.stagesBar.currentStageIndex - (allStagesLength - stages.length)].actions;
      ipcRenderer.once('adPlatformsSelector:authDataResponse', (event, store) => {
        actions.forEach(action => {
          if (['phone', 'city', 'password', 'email', 'login'].indexOf(action.value) !== -1) {
            const id = this.stagesBar.data[this.stagesBar.currentURLIndex].id;
            action.value = store.data[`auth_data_${id}_${action.value}`]
          }
        });

        console.log(actions)
        this.webviewWrapper.performActions({actions:actions}, ()=>{console.log("perfomActions Callback")});
      });

      ipcRenderer.send('adPlatformsSelector:authDataRequest');

      let result = this.stagesBar.nextStage();
      if(stage !== undefined && stage.breakpoint === true) {
        this.pause();
      }

      return result;
    }
    else {
      if(stage !== undefined && stage.breakpoint === true) {
        this.pause();
      }

      return false;
    }
  }

  nextURL() {
    let url = this.webviewWrapper.webview.src;
    url = this.stagesBar.nextURL(url);

    if(url != null) {
      this.webviewWrapper.loadUrl(url, ()=>{this.emit('loaded')} );
    }
    else {
      this.emit('loaded');
    }
  }
}
