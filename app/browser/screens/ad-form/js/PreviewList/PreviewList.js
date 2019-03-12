import EventEmitter from 'events';
import {photosInputInit, dragNDropInit, removeButtonsInit} from './init';

export const fileReadersList = [];
export const fileUrlList = [];

export class PreviewList extends EventEmitter {
  constructor() {
    super();

    photosInputInit.call(this);
    dragNDropInit.call(this);
  }

  append(filesList) {
    const preview = document.querySelector('.photo-input__preview');
    const emptyInput = document.querySelector('.photo-input__body');
    preview.style.display = 'block';
    emptyInput.style.display = 'none';

    let markup = `
      <li class="preview__list-item">
        <img class="preview__list-image">
        <div class="preview__list-item-overlay">
          <span class="list-item__remove-button"></span>
        </div>
      </li>
    `.repeat(filesList.length);
    document.querySelector('.preview__list-item--add').insertAdjacentHTML('beforebegin', markup);
    removeButtonsInit();

    this.emit('loadStart');

    let filesLoadedAmount = 0;
    let imgDOMIndex = fileReadersList.length;
    for (let i = 0; i !== filesList.length; ++i) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(filesList[i]);
      fileUrlList.push(filesList[i]);
      fileReadersList.push(fileReader);

      const imgs = document.querySelectorAll('.preview__list-image');
      fileReader.onload = (event) => {
        imgs[imgDOMIndex++].src = event.target.result;

        if (++filesLoadedAmount === filesList.length &&
          fileReadersList.every(fileReader => fileReader.readyState === 2)) {
          this.emit('loadEnd');
        }
      };
    }
  }
}
