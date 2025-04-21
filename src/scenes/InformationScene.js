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
        this.data = data; 
        console.log('Info',data);
        const fill = this.data.success ? '#008000' : '#FF474C'; 

        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 80, fill: fill, align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.lives = GameData.ROOMS[this.data.room -1].lives;  
        console.log('Info lives', this.lives);
    }

    create() { 
       // this.helper = new Helper(this);
       // this.animationManager = new AnimationManager(this); 
        this.displayAssets(); 
        
    } 
      
    displayAssets() {  
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'info-bg-general').setOrigin(.5); 
        this.pageBg.setInteractive() 

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, this.data.message.title, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY+100, this.data.message.body, this.styleBody).setOrigin(0.5).setDepth(999)

        
  
        if(this.data.gameOver === true ){
            this.createCustomTextButton(this.cameras.main.centerX, this.cameras.main.centerY + 600, () => this.restartGame()) 
            this.createLabel('RESTART GAME', this.cameras.main.centerX , this.cameras.main.centerY + 600)
     
        }else{
            
            if(!this.data.success){
                this.createCustomTextButton(this.cameras.main.centerX - 300, this.cameras.main.centerY + 600, () => this.restartPage()) 
                 
                let retryLabelButton = this.live > 0 ? `RETRY(${this.lives})` : 'RETRY'; 
                this.createLabel(retryLabelButton, this.cameras.main.centerX - 300, this.cameras.main.centerY + 600) 
            }
           
    
            this.createCustomTextButton(this.cameras.main.centerX + 300, this.cameras.main.centerY + 600, () => this.closePage()) 
            this.createLabel('CONTINUE', this.cameras.main.centerX + 300, this.cameras.main.centerY + 600)
        } 
    }
    

    createLabel(text, x, y)
    {
        this.add.text(x, y, text, {
            fontSize: '42px',
            color: 'red', // or '#ff0000' 
             fontStyle: 'bold'
        }).setOrigin(.5);
    }

    createCustomTextButton(x,y, met)
    {  
        this.continueBtn = new ImgButton(this, x, y, 'blank-btn-round', () => met());
        this.add.existing(this.continueBtn)  
    }
  
    closePage()
    {  
        this.scene.stop(CST.SCENES.INFORMATION);  
    }
    restartPage()
    { 
        if(this.lives == 0 ) return;
        if(this.lives <= -2) return;

        this.scene.start(this.data.fromScene);    
    } 
   
    restartGame()
    {
        this.scene.stop(CST.SCENES.INFORMATION);  
        this.scene.stop(CST.SCENES.GAME)  
        this.scene.start(CST.SCENES.HOME) 
    }
}
