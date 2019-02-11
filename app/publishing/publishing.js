import {formInit} from "../common/formInit/formInit"

const nextStage = () => {
    let hasNext = true

    const currentStageIcon = document.querySelector('.publish__stage-icon--active')
    if (currentStageIcon) {
        currentStageIcon.classList.remove('publish__stage-icon--active')

        const currentStage = currentStageIcon.parentNode
        const nextStage = currentStage.nextElementSibling
        if (nextStage) {
            const nextStageIcon = nextStage.querySelector('.publish__stage-icon')
            nextStageIcon.classList.add('publish__stage-icon--active')
        }
        else
            hasNext = false
    }
    else {
        const firstStageIcon = document.querySelector('.publish__stage-icon')
        firstStageIcon.classList.add('publish__stage-icon--active')
    }

    return hasNext
}

document.addEventListener('DOMContentLoaded', () => {
    const interfalField = document.querySelector('#interval')
    formInit([interfalField])

    let timerId = setInterval(() => {
        if (!nextStage())
            clearInterval(timerId)
    }, parseInt(interfalField.value) * 1000)

    interfalField.addEventListener('input', () => {
        if (interfalField.value) {
            clearInterval(timerId)
            timerId = setInterval(() => {
                if (!nextStage())
                    clearInterval(timerId)
            }, parseInt(interfalField.value) * 1000)
        }
    })
})