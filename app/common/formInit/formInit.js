export const focusLabel = (label) => {
    label.style.transition = 'all .1s'
    label.style.color = '#b5051a'
    label.style.fontSize = '16px'
    label.style.top = '-8px'
}

export const blurLabel = (label) => {
    label.style.color = '#6E0510'
    label.style.transition = 'all .1s'
    label.style.fontSize = '24px'
    label.style.top = '10px'
}

export const submitButtonStatus = (fields) => { // value of submitButton.disabled
    return !(fields.every(field => field.value));
}

// field.moveLabel (boolean) - custom prop
export const formInit = (fields /*array*/, submitButton) => {
    fields.forEach(field => {
        const formGroup = field.closest('.form-group')
        const label = formGroup.querySelector('label')
        field.addEventListener('focus', () => {
            if (field.classList.contains('form-select')) {
                formGroup.classList.remove('form-group-select--blured')
                formGroup.classList.add('form-group-select--focused')
            }

            if (field.moveLabel) {
                focusLabel(label)
            }
        })

        field.addEventListener('blur', () => {
            if (field.classList.contains('form-select')) {
                formGroup.classList.remove('form-group-select--focused')
                formGroup.classList.add('form-group-select--blured')
            }

            if (field.moveLabel) {
                label.style.color = '#6E0510'
            }

            if (field.value === '' && field.moveLabel) {
                blurLabel(label)
            }
        })

        field.dispatchEvent(new Event('focus'))
        field.dispatchEvent(new Event('blur'))
    })

    if (submitButton) {
        fields.forEach((field) => {
            field.addEventListener('input', (event) => {
                submitButton.disabled = submitButtonStatus(fields)
            })
        })

        submitButton.disabled = submitButtonStatus(fields)
    }

    // if (userData) {
    //     userData = JSON.parse(userData)
    //     fields.login.value = userData.login
    //     fields.password.value = userData.password
    //
    //     fields.login.focus()
    //     fields.password.focus() // to fix password label under the password value
    // }
}