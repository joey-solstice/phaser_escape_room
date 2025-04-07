import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js"  
import { AnimationManager } from './AnimationManager.js'; 
import { AudioManager } from './AudioManager.js'; 
import { Helper } from './Helper.js'; 


export class GameScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.GAME }) 
        
    }   

    init(data) {
        this.data = data;    
        this.data.room = 1;
    }

   create() { 
    


       this.helper = new Helper(this);
       this.animationManager = new AnimationManager(this); 
       this.displayAssets();  
       setTimeout(() => { 
            this.displayInfo();
        }, 100); 
        
            
        this.animateBackgroundColor()
   } 

   animateBackgroundColor()
   {
        // Create a dummy object with a progress value
        const colorTween = { t: 0 };

        this.tweens.add({
            targets: colorTween,
            t: 100,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                const value = Phaser.Display.Color.Interpolate.ColorWithColor(
                    Phaser.Display.Color.ValueToColor(0xffff00), // bright yellow
                    Phaser.Display.Color.HexStringToColor('#fa311f'),
                    100,
                    colorTween.t
                );

                const color = Phaser.Display.Color.GetColor(value.r, value.g, value.b);
                this.cameras.main.setBackgroundColor(color);
            }
        });
   }
     
   displayAssets() { 
       const roomNumber = 'bg-room-' +  this.data.room;
     
       
       console.log(roomNumber)
       this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, roomNumber).setOrigin(.5); 
       this.pageBg.setInteractive() 
 

       this.closeBtn = new ImgButton(this, 80, 670, 'room-1-btn-collision', () => this.displayInfo());
       this.add.existing(this.closeBtn)  

       this.challengeOne = new ImgButton(this, 380, 575, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 1));
       this.add.existing(this.challengeOne)  

       this.challengeTwo = new ImgButton(this, 740, 555, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 2));
       this.add.existing(this.challengeTwo)  

       this.challengeThree = new ImgButton(this, 400, 900, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 3));
       this.add.existing(this.challengeThree)  

       this.challengeFour = new ImgButton(this, 740, 920, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 4));
       this.add.existing(this.challengeFour)  
   }

   displayInfo()
   { 
        this.scene.run(CST.SCENES.BACKSTORY);
        this.scene.bringToTop(CST.SCENES.BACKSTORY); 
   }

   openChallengeGame(room=1, challenge=1){
        this.scene.run(CST.SCENES.ROOMGAME);
        this.scene.bringToTop(CST.SCENES.ROOMGAME); 
   }
}
