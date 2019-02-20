import {genStagesBarHTML} from "./genStagesBarHTML"

export class StagesBar {
    constructor(options) {
        this.container = document.querySelector('.publish__stage-list')
        this.data = options.data
        this.currentURLIndex = 0
        this.currentURL = options.data[0].url
        this.currentStageIndex = 0

        genStagesBarHTML(this)
    }

    start() {
        const firstStageItem = this.container.querySelector('.publish__stage-icon')
        firstStageItem.classList.add('.publish__stage-icon--active')
    }

    nextURL() {
        if (++this.currentURLIndex !== this.data.length) {
            this.currentURL = this.data[this.currentURLIndex].url
            genStagesBarHTML(this)
        }
    }

    nextStage() {
        ++this.currentStageIndex
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
}