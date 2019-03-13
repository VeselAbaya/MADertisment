import {ipcRenderer} from 'electron';
import {AdPlatformSelector} from './js/AdPlatformSelector/AdPlatformSelector';
import {Modal, NetworkAlert} from '../../components/modal/modal.component';
import {loaderDown, loaderUp} from '../../components/loader/loader.component';
import {ApiRequest} from '../../services/ApiRequest/ApiRequest.service';
import {prevPageButtonInit} from '../../components/prevPageButton/prevPageButton.component';

document.addEventListener('DOMContentLoaded', () => {
  prevPageButtonInit();

  const adSelectorContainer = document.querySelector('.ad-selector');

  loaderUp();
  const apiPlatformsRequest = new ApiRequest('platforms');
  apiPlatformsRequest.on('success', (res) => {
    const platformsData = res.data.adPlatforms;
    const defaultAdPlatforms = res.data.defaultAdPlatforms;

    loaderDown();
    adSelectorContainer.style.display = 'block';

    const platformsAuth = platformsData.map(platform => {
      return {
        id: platform.id,
        authField: platform.authField,
        authData: /*in case if auth data comes from server*/ platform.authData || {}
      };
    });

    try {
      new AdPlatformSelector({
        platformsData: platformsData,
        standardPlatformsIds: defaultAdPlatforms,
        container: document.querySelector('.ad-selector'),
        canChangeData: true,
        showCheckboxes: true,
        showStatuses: true,
        platformsAuth: platformsAuth
      });
    }
    catch (err) {
      if (err.message === 'All platforms are not active') {
        const notActiveErrorAlert = new Modal({
          container: document.querySelector('.not-active-error-alert'),
          overlay: document.querySelector('.modal-overlay'),
        });

        notActiveErrorAlert.on('close', () => {
          ipcRenderer.send('adPlatformSelector:error');
        });

        notActiveErrorAlert.open();
      }

      console.log(err);
    }
  });

  apiPlatformsRequest.on('error', (err) => {
    if (err.message === 'Network Error') {
      loaderDown();
      const networkAlert = new NetworkAlert({
        container: document.querySelector('.network-alert'),
        overlay: document.querySelector('.modal-overlay'),
        retryButton: document.querySelector('.network-alert .button'),
      });

      networkAlert.on('close', (closeButtonClicked) => {
        if (closeButtonClicked) {
          ipcRenderer.send('adPlatformSelector:error');
        }
      });

      networkAlert.on('retry', () => {
        location.reload();
      });

      networkAlert.open();
    }
    else if (err.response.status === 403 || err.response.status === 401) {
      loaderDown();
      // in case if token isn't valid
      const forbiddenAlert = new Modal({
        container: document.querySelector('.forbidden-alert'),
        overlay: document.querySelector('.modal-overlay'),
      });

      forbiddenAlert.on('close', () => {
        ipcRenderer.send('adPlatformSelector:error');
      });

      forbiddenAlert.open();
    }
  });

  apiPlatformsRequest.send();
});