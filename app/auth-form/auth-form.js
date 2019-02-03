import {ipcRenderer} from 'electron'
import axios from 'axios'
import {Modal, NetworkAlert} from "../common/modal/modal"
import {loaderUp, loaderDown} from "../common/loader/loader"
import {authFormInit, submitButtonStatus} from "../common/authFormInit-script/authFormInit"


document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('#auth__form-submit')
    const fields = {
        company: document.querySelector('#company'),
        login: document.querySelector('#email'),
        password: document.querySelector('#password')
    }

    authFormInit(Object.values(fields), submitButton)

    const auth = document.querySelector('.auth')
    const authForm = auth.querySelector('.auth__form')

    // modals
    const networkAlert = new NetworkAlert({
        overlay: document.querySelector('.modal-overlay'),
        container: document.querySelector('.network-alert'),
        onOpen: () => {
            auth.style.filter = 'blur(8px)'
            networkAlert.container.querySelector('.button').focus()
            submitButton.disabled = true
        },
        onClose: () => {
            Object.values(fields).forEach(field => { field.disabled = false })
            auth.style.filter = ''
            submitButton.disabled = submitButtonStatus(Object.values(fields))
            fields.login.focus()
        },
        retryButton: document.querySelector('.network-alert .button'),
        onRetry: () => { submitButton.click() }
    })

    const forbiddenAlert = new Modal({
        overlay: document.querySelector('.modal-overlay'),
        container: document.querySelector('.forbidden-alert'),
        onOpen: () => {
            auth.style.filter = 'blur(8px)'
            submitButton.disabled = true
        },
        onClose: () => {
            Object.values(fields).forEach(field => { field.disabled = false })
            auth.style.filter = ''
            submitButton.disabled = submitButtonStatus(Object.values(fields))
            fields.login.focus()
        }
    })
    // modals

    // submit
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        authForm.querySelector('.button').disabled = true
        loaderUp()
        Object.values(fields).forEach(field => { field.disabled = true })

        try {
            const res = await axios.post('http://madadvertisement.ru:9090/auth', {
                companyName: fields.company.value,
                email: fields.login.value,
                password: fields.password.value
            })

            ipcRenderer.send('auth:success', res.data)
        } catch (error) {
            console.log(Object.values(error))
            if (error.message === 'Network Error') {
                loaderDown()
                networkAlert.open()
            }
            else if (error.response.status === 403) {
                loaderDown()
                forbiddenAlert.open()
            }
        }
    })
})