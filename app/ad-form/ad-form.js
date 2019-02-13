import {ipcRenderer} from 'electron'
import axios from 'axios'
import {formInit} from "../common/formInit/formInit"

document.addEventListener('DOMContentLoaded', () => {
    // receive  data from server
    ipcRenderer.on('response:data', async (event, data) => {
        const formMarkup = (await axios({
            method: 'get',
            url: 'http://madadvertisement.ru/api/form',
            headers: {'token': data.user.userResponse.token},
        })).data.form

        document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup)

        // select init
        const selects = document.querySelectorAll('.form-select')
        selects.forEach(select => { select.moveLabel = false })
        formInit(Array.from(selects))

        // photos input init
        const filesList = [] // this will be sent to server

        const input = document.querySelector('.photo-input__field')
        input.addEventListener('change', () => {
            const preview = document.querySelector('.photo-input__preview')
            const emptyInput = document.querySelector('.photo-input__body')

            if (!input.files.length) {
                preview.style.display = 'none'
                emptyInput.style.display = 'flex'
            }
            else {
                preview.style.display = 'block'
                emptyInput.style.display = 'none'

                let markup = ''
                for (let i = 0; i !== input.files.length; ++i) {
                    filesList.push(input.files[i])

                    markup += `
                    <li class="preview__list-item">
                        <img class="preview__list-image" src="${URL.createObjectURL(input.files[i])}">
                        <div class="preview__list-item-overlay">
                            <span class="list-item__remove-button"></span>
                        </div>
                    </li>
                `
                }

                document.querySelector('.preview__list-item--add').insertAdjacentHTML('beforebegin', markup)

                // remove file button
                const removeButtons = document.querySelectorAll('.list-item__remove-button')
                removeButtons.forEach((removeButton) => {
                    removeButton.addEventListener('click', () => {
                        const list = document.querySelector('.preview__list')
                        const listItem = removeButton.closest('.preview__list-item')
                        const removeIndex = Array.from(list.children).indexOf(listItem)

                        list.removeChild(listItem)
                        filesList.splice(removeIndex, 1)
                    })
                })
            }
        })
    })

    ipcRenderer.send('request:data')
})