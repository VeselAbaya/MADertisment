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

    updateStagesBarHTML(this);
    this.initBreakpointsListeners()
  }

  initBreakpointsListeners() {
    const icons = <HTMLElement[]>document.querySelectorAll('.publish__stage-icon');
    for (let i = 0; i < icons.length; i++) {
      icons[i].addEventListener('click', () => {
        let breakpoint = this.data[this.currentURLIndex].stages[i].breakpoint;

        if(breakpoint === undefined) {
          this.data[this.currentURLIndex].stages[i].breakpoint = true;
        }
        else {
          this.data[this.currentURLIndex].stages[i].breakpoint = !breakpoint;
        }

        if(this.data[this.currentURLIndex].stages[i].breakpoint === true) {
          icons[i].classList.add('publish__stage-icon--breakpoint');
        }
        else {
          icons[i].classList.remove('publish__stage-icon--breakpoint');
        }
      })
    }
  }

  removeBreakpointFor(stage) {
    stage.isBreakpoint = false;

    const icons = <HTMLElement[]>document.querySelectorAll('.publish__stage-icon');
    const stages = this.data[this.currentURLIndex].stages;
    for (let i = 0; i < icons.length; i++) {
      if(stages[i].name == stage.name) {
        this.data[this.currentURLIndex].stages[i].breakpoint = false;
        icons[i].style.backgroundColor='#cecece';
      }
    }
  }

  nextURL() {
    if (++this.currentURLIndex !== this.data.length) {
      this.currentURL = this.data[this.currentURLIndex].url;
      updateStagesBarHTML(this);
      this.initBreakpointsListeners()
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