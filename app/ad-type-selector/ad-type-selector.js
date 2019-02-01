import {ipcRenderer} from 'electron'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.type-selector__type').forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                ipcRenderer.send('adTypeSelector:typeSelected')
            }, 400)
        })
    })
})