import {formInit} from '../../../../components/formInit/formInit.component'

export const updateModalHTML = (options, id) => {
  const accountForm = options.modal.container.querySelector('.auth__form');
  accountForm.querySelectorAll('.form-group').forEach(formGroup => {
    accountForm.removeChild(formGroup)
  });

  let markup = '';
  for (let field of options.platformsAuth.find(auth => auth.id === id).authField) {
    let type = field; // TODO make something more serious
    markup += `
      <div class="form-group">
        <label for="${type}" class="form-label">${type}</label>
        <input id="${type}" name="${type}" class="form-field" type="${type}">
      </div>     
    `
  }

  accountForm.insertAdjacentHTML('afterbegin', markup);

  const authData = options.platformsAuth.find(auth => auth.id === id).authData;
  const fields = Array.from(accountForm.querySelectorAll('.auth__form input'));

  // fields values
  for (let fieldName in authData) {
    if (authData.hasOwnProperty(fieldName)) {
      fields.find(field => field.id === fieldName).value = authData[fieldName]
    }
  }

  // fields init
  fields.forEach((field) => {
    field.moveLabel = true
  });
  formInit(Array.from(fields))
};