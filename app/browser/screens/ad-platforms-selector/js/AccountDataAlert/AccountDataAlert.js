import {ipcRenderer} from 'electron';
import {FormAlert} from '../../../../components/modal/modal.component';

export class AccountDataAlert extends FormAlert {
  constructor(adSelector) {
    super({
      overlay: document.querySelector('.modal-overlay'),
      container: document.querySelector('.modal'),
    });

    this.on('open', () => {
      adSelector.container.style.filter = 'blur(8px)';
    });

    this.on('close', () => {
      adSelector.container.style.filter = '';
      adSelector.modalClose(adSelector.currentOpenedId);
    });

    this.on('formSubmit', (event) => {
      event.preventDefault();

      const authData = adSelector.platformsAuth.find(el => el.id === adSelector.currentOpenedId).authData;
      const fields = Array.from(document.querySelectorAll('.auth__form input'));
      console.log(fields);

      for (let field of fields) {
        authData[field.id] = field.value;

        // saving data in pc local storage
        ipcRenderer.send('adPlatformsSelector:authDataSave', {
          id: adSelector.currentOpenedId,
          fieldName: field.id,
          value: field.value
        })
      }
    });
  }
}


