import {ipcRenderer} from 'electron';
import axios from 'axios';
import {ApiRequest} from '../../services/ApiRequest/ApiRequest.service';
import {Modal, NetworkAlert} from '../../components/modal/modal.component';
import {loaderDown, loaderUp} from '../../components/loader/loader.component';
import {formInit, submitButtonStatus} from '../../components/formInit/formInit.component';
import {domain} from '../../domain';

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('#auth__form-submit');
  const fields = {
    company: document.querySelector('#company'),
    login: document.querySelector('#email'),
    password: document.querySelector('#password')
  };

  Object.values(fields).forEach(field => {
    field.moveLabel = true;
  });

  formInit(Object.values(fields), submitButton);

  const auth = document.querySelector('.auth');
  const authForm = auth.querySelector('.auth__form');

  //prolong
  if (window.history.length < 2) {
    authForm.querySelector('.button').disabled = true;
    loaderUp();
    Object.values(fields).forEach(field => {
      field.disabled = true;
    });

    const apiProlongRequest = new ApiRequest('prolong');
    apiProlongRequest.on('success', (res) => {
      ipcRenderer.send('auth:success', res.data);
    });
    apiProlongRequest.on('error', () => {
      authForm.querySelector('.button').disabled = false;
      loaderDown();
      Object.values(fields).forEach(field => {
        field.disabled = false;
      });
    });

    apiProlongRequest.send();
  }

  // modals
  const modalCloseHandler = () => {
    Object.values(fields).forEach(field => { field.disabled = false; });
    auth.style.filter = '';
    submitButton.disabled = submitButtonStatus(Object.values(fields));
    fields.login.focus();
  };

  const modalOpenHandler = () => {
    auth.style.filter = 'blur(8px)';
    submitButton.disabled = true;
  };

  const networkAlert = new NetworkAlert({
    overlay: document.querySelector('.modal-overlay'),
    container: document.querySelector('.network-alert'),
    retryButton: document.querySelector('.network-alert .button'),
  });

  networkAlert.on('open', () => {
    modalOpenHandler();
    networkAlert.container.querySelector('.button').focus();
  });

  networkAlert.on('close', modalCloseHandler);

  networkAlert.on('retry', () => {
    submitButton.click();
  });

  const forbiddenAlert = new Modal({
    overlay: document.querySelector('.modal-overlay'),
    container: document.querySelector('.forbidden-alert'),
  });

  forbiddenAlert.on('open', modalOpenHandler);

  forbiddenAlert.on('close', modalCloseHandler);
  // modals

  // submit
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    authForm.querySelector('.button').disabled = true;
    loaderUp();
    Object.values(fields).forEach(field => {
      field.disabled = true;
    });

    try {
      const res = await axios.post(`${domain}/auth`, {
        companyName: fields.company.value,
        email: fields.login.value,
        password: fields.password.value
      });

      ipcRenderer.send('auth:success', res.data);
    } catch (error) {
      if (error.message === 'Network Error') {
        loaderDown();
        networkAlert.open();
      }
      else if (error.response.status === 403) {
        loaderDown();
        forbiddenAlert.open();
      }
    }
  });
});