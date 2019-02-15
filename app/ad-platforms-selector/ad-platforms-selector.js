import {ipcRenderer} from 'electron'
import {AdPlatformSelector} from "./js/AdPlatformSelector"
import {Modal, NetworkAlert, AccountDataAlert} from "../common/modal/modal"
import {loaderDown, loaderUp} from "../common/loader/loader"
import {ApiRequest} from "../common/apiRequest/ApiRequest";

document.addEventListener('DOMContentLoaded', () => {
    const adSelectorContainer = document.querySelector('.ad-selector')

    const apiRequest = new ApiRequest('platforms')
    apiRequest.on('success', (res) => {
        loaderUp()
        const platformsData = res.data.adPlatforms
        loaderDown()
        adSelectorContainer.style.display = 'block'

        try {
            const selector = new AdPlatformSelector({
                platformsData,
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
                        const loginValue = event.target[0].value
                        const passwordValue = event.target[1].value
                        let index =
                            selector.platformsAuthData.findIndex(el => el.id === selector.currentOpenedId)

                        if (loginValue && passwordValue) {
                            if (index === -1) {
                                selector.platformsAuthData.push({
                                    id: platformId,
                                    login: loginValue,
                                    password: passwordValue
                                })
                            }
                            else {
                                selector.platformsAuthData[index] = {
                                    id: platformId,
                                    login: loginValue,
                                    password: passwordValue
                                }
                            }

                            ipcRenderer.send('authData:save', selector.platformsAuthData)
                        }
                        else { // remove case (save with empty fields)
                            selector.platformsAuthData.splice(index, 1)
                            ipcRenderer.send('authData:remove', selector.currentOpenedId)
                        }
                    }
                }),
                canChangeData: true,
                showCheckboxes: true,
                showStatuses: true,
                platformsAuthData : [] // TODO take form server
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
        }
    })

    apiRequest.on('error', (err) => {
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