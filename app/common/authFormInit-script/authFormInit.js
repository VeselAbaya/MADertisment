export const focusLabel = (label) => {
    label.style.transition = 'all .1s'
    label.style.color = '#b5051a'
    label.style.fontSize = '16px'
    label.style.top = '-8px'
}

export const blurLabel = (label) => {
    label.style.transition = 'all .1s'
    label.style.fontSize = '24px'
    label.style.top = '7px'
}

export const submitButtonStatus = (fields) => { // value of submitButton.disabled
    return !(fields.login.value && fields.password.value);
}

export const authFormInit = (fields, submitButton) => {
    // let userData = localStorage.getItem('userData')
    // focus and blur
    fields.login.addEventListener('focus', () => {
        console.log('focus login')
        const label = document.querySelector('label[for="login"]')
        focusLabel(label)
    })

    fields.login.addEventListener('blur', (event) => {
        console.log('blur login')
        const label = document.querySelector('label[for="login"]')
        label.style.color = '#aaaaaa'
        if (event.target.value === '')
            blurLabel(label)
    })

    fields.password.addEventListener('focus', () => {
        const label = document.querySelector('label[for="password"]')
        focusLabel(label)
    })

    fields.password.addEventListener('blur', (event) => {
        const label = document.querySelector('label[for="password"]')
        label.style.color = '#aaaaaa'
        if (event.target.value === '')
            blurLabel(label)
    })

    Object.values(fields).forEach((field) => {
        field.addEventListener('input', (event) => {
            submitButton.disabled = submitButtonStatus(fields)
        })
    })

    submitButton.disabled = submitButtonStatus(fields)

    // if (userData) {
    //     userData = JSON.parse(userData)
    //     fields.login.value = userData.login
    //     fields.password.value = userData.password
    //
    //     fields.login.focus()
    //     fields.password.focus() // to fix password label under the password value
    // }
}