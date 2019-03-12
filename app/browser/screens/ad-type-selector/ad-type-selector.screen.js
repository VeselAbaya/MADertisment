import {ipcRenderer} from 'electron';
import {loaderDown, loaderUp} from '../../components/loader/loader.component';
import {ApiRequest} from '../../services/ApiRequest/ApiRequest.service';

const initInterface = async () => {
  loaderUp();

  const apiTypesRequest = new ApiRequest('types');
  apiTypesRequest.on('success', (res) => {
    let markup = '';
    for (let type of res.data.types) {
      markup += `
        <li class="type-selector__types-list-item">
          <button id="${type.id}" class="type-selector__type">${type.name}</button>
        </li>
      `;
    }

    document.querySelector('.type-selector__title').style.display = 'block';
    document.querySelector('.type-selector__types-list').insertAdjacentHTML('beforeend', markup);
    loaderDown();

    document.querySelectorAll('.type-selector__type').forEach(button => {
      button.addEventListener('click', () => {
        button.style.backgroundColor = 'rgba(181, 5, 16, .2)';
        button.style.borderBottomColor = '#b5051a';
        setTimeout(() => {
          ipcRenderer.send('adTypeSelector:typeSelected', {
            session: {
              id: res.data.sessionId,
              token: res.data.sessionToken
            },
            typeId: parseInt(button.id)
          });
        }, 400);
      });
    });
  });

  apiTypesRequest.on('error', () => {
    // TODO something
  });

  apiTypesRequest.send();
};

document.addEventListener('DOMContentLoaded', () => {
  initInterface();
});