import {ipcRenderer} from 'electron'
import {StagesBar} from "./StagesBar"
import {WebviewWrapper} from "../script-tools/renderer"

export class PublishView {
    constructor(options) {
        this.stagesBar = new StagesBar(options)
        this.webview = document.querySelector('webview')
        this.webviewWrapper = new WebviewWrapper(this.webview, ipcRenderer, './script-tools/preload.js')
        this.webview.src = this.stagesBar.currentURL
    }

    nextStage() {
        const stages = this.stagesBar.data[this.stagesBar.currentURLIndex].stages
        if (this.stagesBar.currentStageIndex < stages.length) {
            const actions = stages[this.stagesBar.currentStageIndex].actions
            this.webviewWrapper.performActions(actions)
        }

        return this.stagesBar.nextStage()
    }
}