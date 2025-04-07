import { CST } from "../CST.js";

export class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.PRELOAD })
    }

    preload() {
        // Loading screen 
        this.load.image('bg-preload', './assets/img/scene/preload/blur.png'); 
        this.load.image('bg-loading', './assets/img/scene/preload/bg-loading.png')
        this.load.image('loading-bar', './assets/img/scene/preload/loading-bar.png')
    }

    create() { 
        this.scene.start(CST.SCENES.LOAD)
    }
}
