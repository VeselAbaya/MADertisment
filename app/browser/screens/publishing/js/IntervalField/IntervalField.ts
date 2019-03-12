import {formInit} from '../../../../components/formInit/formInit.component.js';
import {PublishView} from '../PublishView/PublishView';

export class IntervalField {
  public field: HTMLInputElement;
  private publishView: PublishView;
  private timerId: Number;
  public isWorking: boolean;

  constructor(publishView) {
    this.field = <HTMLInputElement>document.querySelector('#interval');

    (<any>this.field).moveLabel = true;
    formInit([this.field]);

    this.publishView = publishView;
    this.isWorking = false;
  }

  play() {
    this.isWorking = true;
    this.publishView.play();
  }

  pause() {
    this.isWorking = false;
    this.publishView.pause();
  }

  startTimer() {
    const setTimer = () => {
      this.timerId = setInterval(() => {
        if (!this.publishView.nextStage()) {
          clearInterval(this.timerId);
          this.isWorking = false;
        }
      }, parseInt(this.field.value) * 1000);

      this.isWorking = true;
    };

    setTimer();

    this.field.addEventListener('input', () => {
      if (this.field.value) {
        clearInterval(this.timerId);
        setTimer();
      }
    })
  }

}
