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
  
      for (let fieldName in authData) {
        const field = fields.find(field => field.id === fieldName);
        authData[field.id] = field.value;

        ipcRenderer.send('adPlatformsSelector:authDataSave', {
          id: adSelector.currentOpenedId,
          fieldName: fieldName,
          value: field.value
        })
      }

      // // saving data in pc local storage
      // for (let fieldName of this.platformsAuth.find(auth => auth.id === id).authField) {
      //   const field = this.modal.container.querySelector('#' + fieldName);
      //   const value = field.value;
      //
      //   ipcRenderer.send('adPlatformsSelector:authDataSave', {
      //     id, fieldName, value
      //   })
      // }
    });
  }
}


