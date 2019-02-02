import {ipcRenderer} from 'electron'
import axios from 'axios'
import {AdPlatformSelector} from "./js/AdPlatformSelector"
import {Modal, NetworkAlert, AccountDataAlert} from "../common/modal/modal"
import {loaderDown, loaderUp} from "../common/loader/loader"

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('response:data', async (event, data) => {
        const adSelectorContainer = document.querySelector('.ad-selector')

        try {
            loaderUp()
            const platformsData = (await axios({
                url: 'http://madadvertisement.ru/api/platforms',
                method: 'get',
                headers: {'token': data.user.user.token}
            })).data.ad_platforms
            loaderDown()
            adSelectorContainer.style.display = 'block'

            const selector = new AdPlatformSelector({
                platformsData,
                standardPlatformsIds: data.user.user.defaultAdPlatformIds,
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
                platformsAuthData : data.auth
            })
        } catch (error) {
            if (error.message === 'All platforms are not active') {
                const notActiveErrorAlert = new Modal({
                    container: document.querySelector('.not-active-error-alert'),
                    overlay: document.querySelector('.modal-overlay'),
                    onClose: () => { ipcRenderer.send('adPlatformSelector:error') }
                })
                notActiveErrorAlert.open()
            }
            else if (error.message === 'Network Error') {
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

    ipcRenderer.send('request:data')
})