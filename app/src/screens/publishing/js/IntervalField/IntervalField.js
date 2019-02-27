import {formInit} from '../../../../components/formInit/formInit.component';

export class IntervalField {
  constructor(publishView) {
    this.field = document.querySelector('#interval');

    this.field.moveLabel = true;
    formInit([this.field]);

    this.publishView = publishView;
  }

  startTimer() {
    const setTimer = () => {
      this.timerId = setInterval(() => {
        if (!this.publishView.nextStage()) {
          clearInterval(this.timerId);
          this.publishView.nextURL();
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