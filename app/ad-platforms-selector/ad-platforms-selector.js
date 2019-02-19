import {ipcRenderer} from 'electron'
import {AdPlatformSelector} from "./js/AdPlatformSelector"
import {Modal, NetworkAlert, AccountDataAlert} from "../common/modal/modal"
import {loaderDown, loaderUp} from "../common/loader/loader"
import {ApiRequest} from "../common/apiRequest/ApiRequest";

document.addEventListener('DOMContentLoaded', () => {
    const adSelectorContainer = document.querySelector('.ad-selector')

    loaderUp()
    const apiPlatformsRequest = new ApiRequest('platforms')
    apiPlatformsRequest.on('success', (res) => {
        const platformsData = res.data.adPlatforms
        loaderDown()
        adSelectorContainer.style.display = 'block'

        const platformsAuth = platformsData.map(platform => {
            return {
                id: platform.id,
                authField: platform.authField,
                authData: platform.authData || {} // TODO there is nothing
            }
        })

        try {
            const selector = new AdPlatformSelector({
                platformsData: platformsData,
                standardPlatformsIds: [], // TODO take form server
                container: document.querySelector('.ad-selector'),
                modal: new AccountDataAlert({
                    overlay: document.querySelector('.modal-overlay'),
                    container: document.querySelector('.modal'),
                    onOpen: () => { selector.container.style.filter = 'blur(8px)' },
                    onClose: () => {
                        selector.container.style.filter = ''
                        selector.modalClose()
                    },
                    onFormSubmit: (event) => {
                        event.preventDefault()
                        const platformId = selector.currentOpenedId
                        let auth =
                            selector.platformsAuth.find(el => el.id === selector.currentOpenedId)

                        for (let field of event.target) {
                            if (field.type !== 'submit') {
                                auth.authData[field.type] = field.value
                            }
                        }
                    }
                }),
                canChangeData: true,
                showCheckboxes: true,
                showStatuses: true,
                platformsAuth: platformsAuth // TODO take form server
            })
        }
        catch (err) {
            if (err.message === 'All platforms are not active') {
                const notActiveErrorAlert = new Modal({
                    container: document.querySelector('.not-active-error-alert'),
                    overlay: document.querySelector('.modal-overlay'),
                    onClose: () => { ipcRenderer.send('adPlatformSelector:error') }
                })
                notActiveErrorAlert.open()
            }

            console.log(err)
        }
    })

    apiPlatformsRequest.on('error', (err) => {
        if (err.message === 'Network Error') {
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
        else if (err.response.status === 403 || err.response.status === 401) {
            loaderDown()
            // in case if token isn't valid
            const forbiddenAlert = new Modal({
                container: document.querySelector('.forbidden-alert'),
                overlay: document.querySelector('.modal-overlay'),
                onClose: () => { ipcRenderer.send('adPlatformSelector:error') }
            })
            forbiddenAlert.open()
        }
    })
})