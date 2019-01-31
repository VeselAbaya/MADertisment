export const focusLabel = (label) => {
    label.style.transition = 'all .1s'
    label.style.color = '#b5051a'
    label.style.fontSize = '16px'
    label.style.top = '-8px'
}

export const blurLabel = (label) => {
    label.style.color = '#aaaaaa'
    label.style.transition = 'all .1s'
    label.style.fontSize = '24px'
    label.style.top = '7px'
}

export const submitButtonStatus = (fields) => { // value of submitButton.disabled
    return !(fields.every(field => field.value));
}

export const authFormInit = (fields, submitButton) => {
    fields.forEach(field => {
        const label = field.closest('.auth__form-group').querySelector('label')
        field.addEventListener('focus', () => { focusLabel(label) })

        field.addEventListener('blur', () => {
            label.style.color = '#aaaaaa'
            if (field.value === '')
                blurLabel(label)
        })
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