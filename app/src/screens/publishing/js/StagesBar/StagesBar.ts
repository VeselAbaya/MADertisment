import {updateStagesBarHTML} from './updateStagesBarHTML.js'

export class StagesBar {
  public container: HTMLUListElement;
  public data: any[];
  public currentURLIndex: number;
  public currentURL: string;
  public currentStageIndex: number;

  constructor(options) {
    this.container = <HTMLUListElement>document.querySelector('.publish__stage-list');
    this.data = options.data;
    this.currentURLIndex = 0;
    this.currentURL = options.data[0].url;
    this.currentStageIndex = 0;

    updateStagesBarHTML(this)
  }

  nextURL() {
    if (++this.currentURLIndex !== this.data.length) {
      this.currentURL = this.data[this.currentURLIndex].url;
      updateStagesBarHTML(this)
    }
  }

  nextStage() {
    ++this.currentStageIndex;
    let hasNext = true;

    const currentStageIcon = document.querySelector('.publish__stage-icon--active');
    if (currentStageIcon) {
      currentStageIcon.classList.remove('publish__stage-icon--active');

      const currentStage: HTMLElement = <HTMLElement>currentStageIcon.parentNode;
      const nextStage = currentStage.nextElementSibling;
      if (nextStage) {
        const nextStageIcon = nextStage.querySelector('.publish__stage-icon');
        nextStageIcon.classList.add('publish__stage-icon--active')
      }
      else {
        hasNext = false
      }
    }
    else {
      const firstStageIcon = document.querySelector('.publish__stage-icon');
      firstStageIcon.classList.add('publish__stage-icon--active')
    }

    return hasNext
  }
}