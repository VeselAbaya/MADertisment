import {selectsInit} from "./js/selectsInit"
import {PreviewList, fileReadersList} from "./js/PreviewList"
import {ApiRequest} from "../common/apiRequest/ApiRequest";

document.addEventListener('DOMContentLoaded', () => {
    const apiRequest = new ApiRequest('form')
    apiRequest.on('success', (res) => {
        console.log(res)
        const formMarkup = res.data.form

        document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup)

        const previewList = new PreviewList()
        selectsInit()
    })

    apiRequest.on('error', (err) => {
        console.log(err)
    })
})