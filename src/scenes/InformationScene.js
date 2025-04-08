import { CST } from "../CST.js" 
import { GameData } from "./GameData.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 
import { AnimationManager } from './AnimationManager.js'; 
import { ITL } from "./ITL.js";

export class InformationScene extends Phaser.Scene {
    
    

    constructor(data) {
        super({ key: CST.SCENES.INFORMATION })  
    }    
 

    init(data) {
        console.log('Inforamation Scene', data)
        this.data = data; 
        const fill = this.data.success ? '#008000' : '#FF474C'; 

        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 80, fill: fill, align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }

    create() { 
       // this.helper = new Helper(this);
       // this.animationManager = new AnimationManager(this); 
        this.displayAssets(); 
        
    } 
      
    displayAssets() {  
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'information-bg-general').setOrigin(.5); 
        this.pageBg.setInteractive() 

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, this.data.message.title, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY+100, this.data.message.body, this.styleBody).setOrigin(0.5).setDepth(999)

        

        this.continueBtn = new ImgButton(this, this.cameras.main.centerX,this.cameras.main.centerY + 600, 'continue-btn-round', () => this.closePage());
        this.add.existing(this.continueBtn)  
    }
    
  
    closePage()
    { 
        this.scene.stop(CST.SCENES.INFORMATION)  
    } 
}
