import _ from 'lodash';
import {ipcRenderer} from 'electron';
import {selectsInit} from '../../components/formInit/formInit.component';
import {fileUrlList, PreviewList} from './js/PreviewList/PreviewList';
import {ApiRequest} from '../../services/ApiRequest/ApiRequest.service';
import {prevPageButtonInit} from '../../components/prevPageButton/prevPageButton.component';
import {loaderDown, loaderUp} from '../../components/loader/loader.component';

document.addEventListener('DOMContentLoaded', () => {
  prevPageButtonInit();

  const apiFormRequest = new ApiRequest('form');
  apiFormRequest.once('success', (res) => {
    loaderDown();

    const formMarkup = res.data.form;
    document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup);

    const form = document.querySelector('.ad-form form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const objArray = [];
      for (let field of event.target) if (field.type !== 'submit') {
        const idParts = field.id.split('.');

        switch (field.type) {
        case 'checkbox':
          objArray.push(idParts.reduceRight((acc, currentValue) => {
            return {[currentValue]: acc};
          }, field.checked));
          break;

        case 'file':
          let filesArray = [];
          fileUrlList.forEach(fileUrl => {
            console.log(fileUrl);
            filesArray.push(fileUrl.path);
          });

          objArray.push(idParts.reduceRight((acc, currentValue) => {
            return {[currentValue]: acc};
          }, filesArray));
          break;

        default:
          objArray.push(idParts.reduceRight((acc, currentValue) => {
            return {[currentValue]: acc};
          }, field.value));
          break;
        }
      }

      const reqBody = _.defaultsDeep(...objArray);
      const submitRequest = new ApiRequest('submit', reqBody);

      submitRequest.once('success', () => {
        loaderDown();
        ipcRenderer.send('adForm:submit');
      });

      submitRequest.send();
    });

    const previewList = new PreviewList();
    const submitButton = form.querySelector('.ad-form__submit-button');
    previewList.on('loadStart', () => {
      submitButton.disabled = true;
    });
    previewList.on('loadEnd', () => {
      submitButton.disabled = false;
    });

    selectsInit();
  });

  apiFormRequest.send();
});
