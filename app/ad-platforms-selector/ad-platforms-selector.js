import {ipcRenderer} from 'electron'
import axios from 'axios'
import {AdPlatformSelector} from "./js/AdPlatformSelector"
import {Modal, NetworkAlert} from "../common/modal/modal"
import {loaderDown, loaderUp} from "../common/loader/loader"
import {authFormInit} from "../common/authFormInit-script/authFormInit"

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('response:userData', async (event, userData) => {
        const adSelectorContainer = document.querySelector('.ad-selector')

        try {
            loaderUp()
            const platformsData = (await axios({
                url: 'http://madadvertisement.ru/api/platforms',
                method: 'get',
                headers: {'token': userData.token}
            })).data.ad_platforms
            loaderDown()
            adSelectorContainer.style.display = 'block'

            const selector = new AdPlatformSelector({
                platformsData,
                container: document.querySelector('.ad-selector'),
                modal: new Modal({
                    overlay: document.querySelector('.modal-overlay'),
                    container: document.querySelector('.modal'),
                    onOpen: () => { selector.container.style.filter = 'blur(8px)' },
                    onClose: () => { selector.container.style.filter = '' }
                }),
                canChangeData: true,
                showCheckboxes: true,
                showStatuses: true,
                platformsAuthData : [
                    {
                        "id": 0,
                        "login": "0timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 1,
                        "login": "1timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 2,
                        "login": "2timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 3,
                        "login": "3timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 4,
                        "login": "4timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 5,
                        "login": "5timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 6,
                        "login": "6timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 7,
                        "login": "7timtim@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 8,
                        "login": "timt8m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 9,
                        "login": "timt9m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 10,
                        "login": "timt10m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 11,
                        "login": "tim11m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 12,
                        "login": "timt12m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 13,
                        "login": "timt13m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 14,
                        "login": "tim114@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 15,
                        "login": "timt15m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 16,
                        "login": "timt16m@timtim.tech",
                        "password": "ti137arg"
                    },
                    {
                        "id": 17,
                        "login": "tim117@timtim.tech",
                        "password": "ti137arg"
                    }
                ]
            })

            // modal
            authFormInit({
                login: document.querySelector('#login'),
                password: document.querySelector('#password')
            }, document.querySelector('#auth__form-submit'))

            const modalCloseButton = document.querySelector('.modal__close')
            document.querySelectorAll('.ad-selector__platform-button--settings').forEach(button => {
                button.addEventListener('click', () => {
                    selector.blinkSettings(parseInt(button.dataset['id']))

                    modalCloseButton.dataset['id'] = button.dataset['id']
                    setTimeout(() => {
                        selector.modalOpen(parseInt(button.dataset['id']))
                    }, 400)
                })
            })

            modalCloseButton.addEventListener('click', () => {
                selector.modalClose(parseInt(modalCloseButton.dataset['id']))
            })

            document.querySelector('.auth__form').addEventListener('submit', (event) => {
                event.preventDefault()
                // TODO send to server new auth data
                selector.modalClose(parseInt(modalCloseButton.dataset['id']))
            })
            // modal
        } catch (error) {
            console.log(error)
            if (error.message === 'Network Error') {
                loaderDown()
                const networkAlert = new NetworkAlert({
                    container: document.querySelector('.network-alert'),
                    overlay: document.querySelector('.modal-overlay'),
                    retryButton: document.querySelector('.network-alert .button'),
                    onCloseButtonClick: () => { ipcRenderer.send('adPlatformSelector:error') },
                    onRetry: () => { location.reload() }
                })
                networkAlert.open()
            }
            else if (error.response.status === 403) {
                loaderDown()
                // in case if token isn't valid
                const forbiddenAlert = new Modal({
                    container: document.querySelector('.forbidden-alert'),
                    overlay: document.querySelector('.modal-overlay'),
                    onClose: () => { ipcRenderer.send('adPlatformSelector:error') }
                })
                forbiddenAlert.open()
            }
        }
    })

    ipcRenderer.send('request:userData')
})