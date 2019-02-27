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
      adSelector.modalClose();
    });

    this.on('formSubmit', (event) => {
      event.preventDefault();
      let auth = adSelector.platformsAuth.find(el => el.id === adSelector.currentOpenedId);

      for (let field of event.target) {
        if (field.type !== 'submit') {
          auth.authData[field.type] = field.value
        }
      }
    });
  }
}


