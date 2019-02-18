export const genModalHTML = (options, id) => {
    const accountForm = options.modal.container.querySelector('.auth__form')
    accountForm.querySelectorAll('form-group').forEach(formGroup => {
        accountForm.removeChild(formGroup)
    })

    let markup = ''
    for (let field of options.platformsAuth.find(auth => auth.id === id).authField) {
        let type = field // TODO make something more serious
        markup += `
                    <div class="form-group">
                        <label for="${type}" class="form-label">${type}</label>
                        <input id="${type}" name="${type}" class="form-field" type="${type}">
                    </div>     
                `
    }

    options.modal.container.insertAdjacentHTML('afterbegin', markup)
}