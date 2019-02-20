import {formInit} from "../common/formInit/formInit"
import {ApiRequest} from "../common/apiRequest/ApiRequest"
import {PublishView} from "./js/PublishView"

document.addEventListener('DOMContentLoaded', () => {
    const apiPublishRequest = new ApiRequest('publish')
    apiPublishRequest.on('success', (res) => {
        const publishView = new PublishView(res.data)
        console.log(res.data)

        const intervalField = document.querySelector('#interval')
        intervalField.moveLabel = true
        formInit([intervalField])

        let timerId = setInterval(() => {
            if (!publishView.nextStage())
                clearInterval(timerId)
        }, parseInt(intervalField.value) * 1000)

        intervalField.addEventListener('input', () => {
            if (intervalField.value) {
                clearInterval(timerId)
                timerId = setInterval(() => {
                    if (!publishView.nextStage())
                        clearInterval(timerId)
                }, parseInt(intervalField.value) * 1000)
            }
        })
    })
})