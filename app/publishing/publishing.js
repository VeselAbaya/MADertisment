const nextStage = () => {
    const currentStageIcon = document.querySelector('.publish__stage-icon--active')
    if (currentStageIcon) {
        currentStageIcon.classList.remove('publish__stage-icon--active')

        const currentStage = currentStageIcon.parentNode
        const nextStage = currentStage.nextElementSibling
        console.log(nextStage)
        if (nextStage) {
            const nextStageIcon = nextStage.querySelector('.publish__stage-icon')
            nextStageIcon.classList.add('publish__stage-icon--active')
        }
    }
    else {
        const firstStageIcon = document.querySelector('.publish__stage-icon')
        firstStageIcon.classList.add('publish__stage-icon--active')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    nextStage()
    nextStage()
    nextStage()
    nextStage()
    nextStage()
    nextStage()
})