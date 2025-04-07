import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 


export class HowToScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.HOWTO })  
    }   

    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 
    } 
      
    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'howtoBg').setOrigin(.5); 
        this.pageBg.setInteractive()
         
        const text = "CAMPAIGN INFO";
        this.helper.createInfoText(text);

        const textTerms = "T&C";
        this.helper.createTermsText(textTerms);

        this.closeBtn = new ImgButton(this, 990, 600, 'closeButton', () => this.closePage());
        this.add.existing(this.closeBtn)  
    }  

    closePage()
    {
        this.scene.get(CST.SCENES.GAME).displayEmailField();
        this.scene.stop(CST.SCENES.HOWTO);
    }
}
