import {ApiRequest} from '../../services/ApiRequest/ApiRequest.service';
import {PublishView} from './js/PublishView/PublishView';
import {IntervalField} from './js/IntervalField/IntervalField';

document.addEventListener('DOMContentLoaded', () => {
  const apiPublishRequest = new ApiRequest('publish');
  apiPublishRequest.on('success', (res) => {
    const publishView = new PublishView(res.data);

    const intervalField = new IntervalField(publishView);
    publishView.on('loaded', () => {
      if (!intervalField.isWorking) {
        intervalField.startTimer();
      }

      if (publishView.isLastStage()) {
        publishView.nextURL();
      }
    });

    const playPauseButton = document.querySelector('#publish__screen-play-pause');
    playPauseButton.addEventListener('click', () => {
      const text = playPauseButton.innerHTML;

      if (text === 'Продолжить') {
        intervalField.play();
      }
      else if (text === 'Пауза') {
        intervalField.pause();
      }
    });
  });

  apiPublishRequest.send();
});