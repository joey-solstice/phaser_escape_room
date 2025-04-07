import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 
import { AnimationManager } from './AnimationManager.js'; 

export class HomeScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.HOME })  
    }   

    create() { 
        this.helper = new Helper(this);
        this.animationManager = new AnimationManager(this);

        this.displayAssets(); 
    } 
      
    displayAssets() { 
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'homeBg').setOrigin(.5); 
        this.pageBg.setInteractive()
          
        this.playBtn = new ImgButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 700, 'playBtn', () => this.startGame());
        this.add.existing(this.playBtn)  
        this.animationManager.animateButton(this.playBtn);  
    }

    startGame()
    {
        this.scene.start(CST.SCENES.GAME); 
    }
}
