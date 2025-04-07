import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 


export class ErrorScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.ERROR})  
         
    }   
    init(data)
    {
        this.data = data
    }

    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 
    } 
      
    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'howtoBg').setOrigin(.5); 
        this.pageBg.setInteractive()
         
        const text = "";
        this.helper.createInfoText(text);

        const textTerms = this.data.message;
        this.helper.createTermsText(textTerms); 

        if(this.data.closable){ 
            this.closeBtn = new ImgButton(this, 990, 600, 'closeButton', () => this.closePage());
            this.add.existing(this.closeBtn)  
        }
    }

    closePage()
    {
        this.scene.get(CST.SCENES.GAME).resetField();
        this.scene.stop(CST.SCENES.ERROR);  
    }
}
