import {formInit} from '../formInit/formInit.component'
import EventEmitter from 'events'

export class Modal extends EventEmitter {
  constructor(options) {
    super();

    this.container = options.container;
    this.overlay = options.overlay;
    this.opened = false;

    this.container.style.display = 'block';

    this.closeButtonClicked = false;
    this.container.querySelector('.modal__close').addEventListener('click', () => {
      this.close();
      this.closeButtonClicked = true;
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape')
        this.container.querySelector('.modal__close').click()
    })
  }

  open() {
    if (!this.opened) {
      this.opened = true;
      this.emit('open');

      document.body.style.overflowY = 'hidden';

      this.container.style.visibility = 'visible';
      this.container.style.top = '4vh';
      this.container.style.opacity = 1;

      this.overlay.style.display = 'block';
      this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
    }
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.emit('close', this.closeButtonClicked);

      document.body.style.overflowY = 'auto';

      this.container.style.visibility = 'hidden';
      this.container.style.top = '0vh';
      this.container.style.opacity = 0;

      this.overlay.style.display = 'none';
      this.overlay.style.backgroundColor = ''
    }
  }
}

export class NetworkAlert extends Modal {
  constructor(options) {
    super(options);
    this.retryButton = options.retryButton;

    this.retryButton.addEventListener('click', () => {
      this.close();
      this.emit('retry');
    })
  }
}

export class FormAlert extends Modal {
  constructor(options) {
    super(options);

    const fields = this.container.querySelectorAll('.auth__form input');
    fields.forEach((field) => {
      field.moveLabel = true
    });
    formInit(Array.from(fields));

    this.container.querySelector('.auth__form').addEventListener('submit', (event) => {
      this.emit('formSubmit', event);
      this.close()
    })
  }

  get fields() {
    return this.container.querySelectorAll('.auth__form input')
  }
}