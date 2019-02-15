import {selectsInit} from "./js/selectsInit"
import {PreviewList, fileReadersList} from "./js/PreviewList"
import {ApiRequest} from "../common/apiRequest/ApiRequest";

document.addEventListener('DOMContentLoaded', () => {
    const apiFormRequest = new ApiRequest('form')
    apiFormRequest.on('success', (res) => {
        const formMarkup = res.data.form
        document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup)

        const previewList = new PreviewList()
        selectsInit()
    })
})