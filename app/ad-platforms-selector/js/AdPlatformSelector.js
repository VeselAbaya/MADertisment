import {ipcRenderer} from 'electron'
import {focusLabel, blurLabel} from "../../common/formInit/formInit"

const genHTML = (options) => {
    const button = (data) => {
        if (!data.active)
            return {
                img: 'img/not_active.png',
                class: 'ad-selector__platform-button--not-active',
                type: 'not-active'
            }

        if (options.canChangeData)
            return {
                img: 'img/settings.png',
                class: 'ad-selector__platform-button--settings',
                type: 'settings'
            }

        if (data.changed)
            return {
                img: 'img/changed.png',
                class: 'ad-selector__platform-button--changed',
                type: 'changed'
            }
        else
            return {
                img: 'img/active.png',
                class: 'ad-selector__platform-button--active',
                type: 'active'
            }
    }

    let markup = ''
    for (let data of options.platformsData) {
        const buttonData = button(data)
        markup += `
            <li class="ad-selector__platform">
                <label class="form-checkbox-label">
                    <input class="form-checkbox" id="${data.id}" 
                       ${options.showCheckboxes && data.active ? '' : 'disabled'} type="checkbox"
                       ${options.standardPlatformsIds.includes(data.id) && data.active ? 'checked' : ''}>
                    <span class="checkmark" 
                          style="${options.showCheckboxes ? "" : "display: none"}"></span>
                    <div class="ad-selector__platform-info">
                        <img class="ad-selector__platform-icon" 
                             src="${data.icon}" width="50" height="50">
                        <div class="wrapper">
                            <p class="ad-selector__platform-name">${data.name}</p>
                            <p class="ad-selector__platform-descr">${data.description}</p>
                        </div>
                    </div>
        
                    <button type="button" data-id="${data.id}"
                            style="${options.showStatuses || options.canChangeData && data.active ?
            '' : 'display: none'}"
                            class="ad-selector__platform-button ${buttonData.class}
                                   ad-selector__platform-button--tooltip
                                   ad-selector__platform-button--tooltip-${buttonData.type}"
                            ${buttonData.class.includes('settings') ? '' : 'tabindex="-1"'}>
                            <span class="ad-selector__platform-button ad-selector__platform-button-icon--${buttonData.type}"
                                  data-id="${data.id}"></span>
                    </button>
                </label>
            </li>
        `
    }

    options.container.querySelector('.ad-selector__platforms').insertAdjacentHTML('beforeend', markup)
}

export class AdPlatformSelector {
    constructor(options) {
        this.platformsData = options.platformsData               // Array
        this.platformsAuthData = options.platformsAuthData       // Array
        this.standardPlatformsIds = options.standardPlatformsIds // Array
        this.showCheckboxes = options.showCheckboxes             // boolean
        this.showStatuses = options.showStatuses                 // boolean
        this.canChangeData = options.canChangeData               // boolean
        this.container = options.container                       // DOMElement
        this.modal = options.modal                               // /app/common/modal
        this.currentOpenedId = null                              // Number

        genHTML(options)

        this.container.querySelectorAll('.ad-selector__platform-button--settings').forEach(button => {
            button.addEventListener('click', () => {
                const platformId = parseInt(button.dataset['id'])
                this.blinkSettings(platformId)

                setTimeout(() => {
                    this.modalOpen(platformId)
                }, 1000)
            })
        })

        const startButton = this.container.querySelector('.ad-selector__submit')
        if (this.selectedPlatformsIds.length)
            startButton.disabled = false

        const checkboxes = this.container.querySelectorAll('.form-checkbox')
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('input', () => {
                startButton.disabled = !Array.from(checkboxes).some(checkbox => checkbox.checked)
            })
        })

        const rememberCheckbox = this.container.querySelector('.ad-selector__remember-checkbox')
        this.container.querySelector('.ad-selector__form').addEventListener('submit', () => {
            event.preventDefault()
            const selectedPlatformsIds = this.selectedPlatformsIds
            if (rememberCheckbox.checked) {
                // send selectedPlatformsIds to the server
            }

            let allAccountDataFilled = true
            selectedPlatformsIds.forEach(id => {
                const authData = this.platformsAuthData.find(authData => authData.id === id)
                if (!authData || !authData.login || !authData.password) {
                    allAccountDataFilled = false
                    this.blinkSettings(id)
                }
            })

            if (allAccountDataFilled)
                ipcRenderer.send('adPlatformsSelector:submit')
        })

        // error if all platforms are not active
        if (this.platformsData.every(platform => !platform.active))
            throw new Error('All platforms are not active')
    }

    get selectedPlatformsIds() {
        const checkboxes = this.container.querySelectorAll('.form-checkbox')
        return Array.from(checkboxes)
          .filter(el => el.checked === true)
          .map(el => parseInt(el.id))
    }

    modalOpen(id) {
        if (!this.modal.opened) {
            this.currentOpenedId = id
            this.modal.open()

            const loginField = this.modal.container.querySelector('#login')
            const passwordField = this.modal.container.querySelector('#password')

            const authData = this.platformsAuthData.find(el => el.id === this.currentOpenedId)
            if (authData) {
                loginField.value = authData.login
                passwordField.value = authData.password
            }

            if (loginField.value && passwordField.value) {
                this.modal.container.querySelectorAll('.form-label').forEach(label => {
                    // TODO fix that SHIT!!!
                    focusLabel(label)
                })
            }
        }
    }

    modalClose() {
        this.modal.container.querySelector('#login').value = ''
        this.modal.container.querySelector('#password').value = ''
        this.modal.container.querySelectorAll('.form-label').forEach(label => {
            // TODO fix that SHIT!!!
            blurLabel(label)
        })
    }

    blinkSettings(id) {
        const icon = this.container.querySelector(`button[data-id="${id}"] span`)
        icon.style.backgroundColor = '#b5051a'

        setTimeout(() => {
            icon.style.backgroundColor = '#000000'
        }, 500)
    }
}
