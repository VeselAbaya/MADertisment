import axios from 'axios'
import {ipcRenderer} from 'electron'
import {domain} from "../domain";
import {EventEmitter} from "events";

/**
 * @param apiMethod - part of url after api/__
 * @param callback - function (response)
 */
export class ApiRequest extends EventEmitter {
    constructor(apiMethod, reqBody) {
        super()

        this.url = `${domain}/api/${apiMethod}`
        ipcRenderer.on('response:data', async (event, data) => {
            switch (apiMethod) {
                case 'types':
                    axios({
                        method: 'post',
                        url: this.url,
                        headers: {token: data.user.userResponse.token},
                        data: {
                            action: 'create'
                        }
                    })
                        .then(res => { this.emit('success', res) })
                        .catch(err => { this.emit('error', err) })
                break

                case 'platforms':
                    axios({
                        url: this.url,
                        method: 'post',
                        headers: {'token': data.user.userResponse.token},
                        data: {
                            action: 'create',
                            sessionId: data.session.id,
                            sessionToken: data.session.token,
                            selectedAdType: data.typeId
                        }
                    })
                        .then(res => { this.emit('success', res) })
                        .catch(err => { this.emit('error', err) })
                break

                case 'form':
                    axios({
                        method: 'post',
                        url: this.url,
                        headers: {'token': data.user.userResponse.token},
                        data: {
                            action: 'create',
                            sessionToken: data.session.token,
                            sessionId: data.session.id,
                            selectedPlatforms: data.platforms.selectedPlatforms,
                            isStandardChoice: data.platforms.isStandardChoice
                        }
                    })
                        .then(res => { this.emit('success', res) })
                        .catch(err => { this.emit('error', err) })
                break

                case 'submit':
                    axios({
                        method: 'post',
                        url: this.url,
                        headers: {'token': data.user.userResponse.token},
                        data: {
                            action: "create",
                            sessionToken: data.session.token,
                            sessionId: data.session.id,
                            formData: {
                                reqBody
                            }
                        }
                    })
                        .then(res => { this.emit('success', res) })
                        .catch(err => { this.emit('error', err) })
                break

                case 'publish':
                    this.emit('success', {
                        "status": "ok",
                        "data": [
                            {
                                "url": "https://realty.yandex.ru/management-new/add/",
                                "stages": [
                                    {
                                        "name": "Тип объявления",
                                        "actions": [
                                            {
                                                "selector": "#userType-AGENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#type-RENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#category-ROOMS",
                                                "type": "click"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Описание",
                                        "actions": [
                                            {
                                                "selector": "#userType-AGENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#type-RENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#category-ROOMS",
                                                "type": "click"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "url": "https://avito.ru/publish",
                                "stages": [
                                    {
                                        "name": "Тип объявления",
                                        "actions": [
                                            {
                                                "selector": "#userType-AGENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#type-RENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#category-ROOMS",
                                                "type": "click"
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Описание",
                                        "actions": [
                                            {
                                                "selector": "#userType-AGENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#type-RENT",
                                                "type": "click"
                                            },
                                            {
                                                "selector": "#category-ROOMS",
                                                "type": "click"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    })
                break
            }
        })

        ipcRenderer.send('request:data')
    }
}
