import {StagesBar} from "./StageBar"

export class PublishView {
    constructor(options) {
        this.stagesBar = new StagesBar(options)
        this.webview = document.querySelector('webview')
        this.webview.src = this.stagesBar.currentURL
    }

    
}