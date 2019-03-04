import {formInit} from '../../../../components/formInit/formInit.component.js';
import {PublishView} from '../PublishView/PublishView';

export class IntervalField {
  public field: HTMLInputElement;
  private publishView: PublishView;
  private timerId: Number;

  constructor(publishView) {
    this.field = <HTMLInputElement>document.querySelector('#interval');

    (<any>this.field).moveLabel = true;
    formInit([this.field]);

    this.publishView = publishView;
  }

  startTimer() {
    const setTimer = () => {
      this.timerId = setInterval(() => {
        if (!this.publishView.nextStage()) {
          clearInterval(this.timerId);
        }
      }, parseInt(this.field.value) * 1000);
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
