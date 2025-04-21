import { CST } from "../CST.js" 
import { GameData } from "./GameData.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 
import { AnimationManager } from './AnimationManager.js'; 
import { ITL } from "./ITL.js";

export class RoomInfo extends Phaser.Scene {
    
    

    constructor(data) {
        super({ key: CST.SCENES.ROOMINFO })  
    }   
 

    init(data) {
        console.log(data)
         this.data = data;
         this.countSecs = 6;  
         this.data.room = this.data.room ? this.data.room : 1;
         this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold' }    
         this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }

    create() { 
       // this.helper = new Helper(this);
       // this.animationManager = new AnimationManager(this); 
        this.displayAssets(); 
        
    } 
      
    displayAssets() {   
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'info-bg-general' ).setOrigin(.5); 
        this.pageBg.setInteractive() 

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, GameData.ROOMS[0].name, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY+100, GameData.ROOMS[0].description, this.styleBody).setOrigin(0.5).setDepth(999)

        

        this.closeBtn = new ImgButton(this, 990, 600, 'close-btn-round', () => this.closePage());
        this.add.existing(this.closeBtn)  
    }
    
    closePage()
    { 
        this.scene.stop(CST.SCENES.ROOMINFO)  
    } 
}
