import {ipcRenderer} from 'electron'
import {selectsInit} from "./js/selectsInit"
import {fileReadersList, PreviewList} from "./js/PreviewList"
import {ApiRequest} from "../common/apiRequest/ApiRequest";
import _ from "lodash"

document.addEventListener('DOMContentLoaded', () => {
    const apiFormRequest = new ApiRequest('form')
    apiFormRequest.once('success', (res) => {
        const formMarkup = res.data.form
        document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup)

        const form = document.querySelector('.ad-form form')
        form.addEventListener('submit', (event) => {
            event.preventDefault()

            const objArray = []
            for (let field of event.target) if (field.type !== 'submit') {
                const idParts = field.id.split('.')

                switch (field.type) {
                    case 'checkbox':
                        objArray.push(idParts.reduceRight((acc, currentValue) => {
                            return { [currentValue]: acc }
                        }, field.checked))
                    break

                    case 'file':
                        let filesArray = []
                        fileReadersList.forEach(fileReader => { filesArray.push(fileReader.result) })

                        objArray.push(idParts.reduceRight((acc, currentValue) => {
                            return { [currentValue]: acc }
                        }, filesArray))
                    break

                    default:
                        objArray.push(idParts.reduceRight((acc, currentValue) => {
                            return { [currentValue]: acc }
                        }, field.value))
                    break
                }
            }

            const reqBody = _.defaultsDeep(...objArray)

            new ApiRequest('submit', reqBody)
            ipcRenderer.send('adForm:submit')
        })

        const previewList = new PreviewList()
        const submitButton = form.querySelector('.ad-form__submit-button')
        previewList.on('loadStart', () => { submitButton.disabled = true })
        previewList.on('loadEnd', () => { submitButton.disabled = false })

        selectsInit()
    })
})
