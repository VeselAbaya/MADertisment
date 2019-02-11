import {ipcRenderer} from 'electron'
import axios from 'axios'
import {loaderUp, loaderDown} from "../common/loader/loader"

const initInterface = async () => {
    loaderUp()
    ipcRenderer.send('request:data')
    ipcRenderer.on('response:data', async (event, data) => {
        const res = await axios({
            method: 'get',
            url: 'http://madadvertisement.ru:9090/api/types',
            headers: {
                token: data.user.userResponse.token
            },
            data: {
                action: 'create'
            }
        })

        let markup = '';
        for (let type of res.data.types) {
            markup += `
                <li class="type-selector__types-list-item">
                    <button id="${type.id}" class="type-selector__type">${type.name}</button>
                </li>
            `
        }

        document.querySelector('.type-selector__title').style.display = 'block'
        document.querySelector('.type-selector__types-list').insertAdjacentHTML('beforeend', markup)
        loaderDown()

        document.querySelectorAll('.type-selector__type').forEach(button => {
            button.addEventListener('click', () => {
                button.style.backgroundColor = 'rgba(181, 5, 16, .2)'
                button.style.borderBottomColor = '#b5051a'
                setTimeout(() => {
                    ipcRenderer.send('adTypeSelector:typeSelected', {
                        session: {
                            id: res.data.sessionId,
                            token: res.data.sessionToken
                        },
                        typeId: parseInt(button.id)
                    })
                }, 400)
            })
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    initInterface()
})