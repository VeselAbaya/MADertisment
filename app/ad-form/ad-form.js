import {ipcRenderer} from 'electron'
import axios from 'axios'
import {selectsInit} from "./js/selectsInit"
import {PreviewList, fileReadersList} from "./js/PreviewList"

document.addEventListener('DOMContentLoaded', () => {
    // receive  data from server
    ipcRenderer.on('response:data', async (event, data) => {
        const formMarkup = (await axios({
            method: 'get',
            url: 'http://madadvertisement.ru/api/form',
            headers: {'token': data.user.userResponse.token},
        })).data.form

        document.querySelector('.ad-form').insertAdjacentHTML('beforeend', formMarkup)

        const previewList = new PreviewList()
        selectsInit()
    })

    ipcRenderer.send('request:data')
})