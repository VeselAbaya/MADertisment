const interfaceInit = (options) => {
    const button = (data) => {
        if (!data.active)
            return {
                img: 'img/not_active.png',
                class: 'ad-selector__platform-button--not-active ' +
                       'ad-selector__platform-button--tooltip'
            }

        if (options.canChangeData)
            return {
                img: 'img/settings.png',
                class: 'ad-selector__platform-button--settings'
            }

        if (data.changed)
            return {
                img: 'img/changed.png',
                class: 'ad-selector__platform-button--changed ' +
                       'ad-selector__platform-button--tooltip'
            }
        else
            return {
                img: 'img/active.png',
                class: 'ad-selector__platform-button--active ' +
                       'ad-selector__platform-button--tooltip'
            }
    }

    let markup = ''
    for (let data of options.platformsData) {
        const buttonData = button(data)
        markup += `
            <li class="ad-selector__platform">
                <label class="ad-selector__label">
                    <input class="ad-selector__checkbox" id="${data.id}" 
                           ${options.showCheckboxes && data.active ? '' : 'disabled'} type="checkbox">
                    <span class="checkmark" 
                          style="${options.showCheckboxes ? "" : "display: none"}"></span>
                    <div class="ad-selector__platform-info">
                        <img class="ad-selector__platform-icon" 
                             src="${data.favicon}" width="50" height="50">
                        <div class="wrapper">
                            <p class="ad-selector__platform-name">${data.name}</p>
                            <p class="ad-selector__platform-descr">${data.description}</p>
                        </div>
                    </div>
        
                    <button type="button" data-id="${data.id}"
                            style="${options.showStatuses || options.canChangeData && data.active ? '' : 'display: none'}"
                            class="ad-selector__platform-button ${buttonData.class}"
                            ${buttonData.class.includes('settings') ? '' : 'tabindex="-1"'}>
                        <img src="${buttonData.img}" width="56" height="56"
                             class="platform-button__icon">
                    </button>
                </label>
            </li>
        `
    }

    options.container.querySelector('.ad-selector__platforms').insertAdjacentHTML('beforeend', markup)
}

export class AdPlatformSelector {
    constructor(options) {
        this.platformsData = options.platformsData          // Array
        this.platformsAuthData = options.platformsAuthData  // Array
        this.showCheckboxes = options.showCheckboxes        // boolean
        this.showStatuses = options.showStatuses            // boolean
        this.canChangeData = options.canChangeData          // boolean
        this.container = options.container                  // DOMElement
        this.modal = options.modal                          // /app/common/modal

        interfaceInit(options)
    }

    modalOpen(id) {
        if (!this.modal.opened) {
            this.modal.open()

            const loginField = this.modal.container.querySelector('#login')
            const passwordField = this.modal.container.querySelector('#password')

            const authData = this.platformsAuthData.find(el => el.id === id)
            loginField.value = authData.login
            passwordField.value = authData.password

            if (loginField.value && passwordField.value)
                document.querySelector('#auth__form-submit').disabled = false
            else
                document.querySelector('#auth__form-submit').disabled = true

            passwordField.focus()
            loginField.focus()
        }
    }

    modalClose(id) {
        if (this.modal.opened) {
            this.modal.close()

            const loginField = this.modal.container.querySelector('#login')
            const passwordField = this.modal.container.querySelector('#password')

            const authData = this.platformsAuthData.find(el => el.id === id)
            authData.login = loginField.value
            authData.password = passwordField.value
        }
    }

    blinkSettings(id) {
        const button =
          this.container.querySelector(`.ad-selector__platform-button--settings[data-id="${id}"]`)
    }
}
