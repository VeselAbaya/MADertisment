export const genStagesBarHTML = (stagesBar) => {
    stagesBar.container.innerHTML = ''

    let markup = ''
    for (let stage of stagesBar.data[stagesBar.currentURLIndex].stages) {
        markup += `
            <li class="publish__stage-item">
                <span class="publish__stage-icon"></span>
                <p class="publish__stage-title">${stage.name}</p>
            </li>
        `
    }

    stagesBar.container.insertAdjacentHTML('beforeend', markup)
}