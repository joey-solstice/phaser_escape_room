import { CST } from "../CST.js" 
import { GameData } from "./GameData.js" 
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
        console.log('MAIN GAME: ', data)
    }

   create() { 

       this.helper = new Helper(this);
       this.animationManager = new AnimationManager(this); 
       this.displayAssets();  
     
        this.animateBackgroundColor()
        this.clickAudio = this.sound.add('click');
   } 

   updateLives(increase = true)
   { 
        console.log(GameData.ROOMS[this.data.room - 1].lives)

        if(GameData.ROOMS[this.data.room - 1].lives == -1) return; // -1 = Unlimited lives 



        if(increase){
            GameData.ROOMS[this.data.room - 1].lives +=1;
        }else{
            GameData.ROOMS[this.data.room - 1].lives -=1;
        }
 
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
       const roomNumber = 'bg-room-' + this.data.room;
     
      
        
       this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, roomNumber).setOrigin(.5); 
       this.pageBg.setInteractive() 
 
       console.log(GameData.ROOMS[this.data.room -1].buttons[0].x,GameData.ROOMS[this.data.room-1].buttons[0].y);

       this.closeBtn = new ImgButton(this, GameData.ROOMS[this.data.room -1].buttons[0].x, GameData.ROOMS[this.data.room-1].buttons[0].y, 'room-1-btn-collision', () => this.displayInfo());
       this.add.existing(this.closeBtn)  

       this.challengeOne = new ImgButton(this, GameData.ROOMS[this.data.room -1].buttons[1].x,GameData.ROOMS[this.data.room-1].buttons[1].y, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 1));
       this.add.existing(this.challengeOne)  

       this.challengeTwo = new ImgButton(this, GameData.ROOMS[this.data.room -1].buttons[2].x,GameData.ROOMS[this.data.room-1].buttons[2].y, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 2));
       this.add.existing(this.challengeTwo)  

       this.challengeThree = new ImgButton(this, GameData.ROOMS[this.data.room -1].buttons[3].x,GameData.ROOMS[this.data.room-1].buttons[3].y, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 3));
       this.add.existing(this.challengeThree)  

       this.challengeFour = new ImgButton(this, GameData.ROOMS[this.data.room -1].buttons[4].x,GameData.ROOMS[this.data.room-1].buttons[4].y, 'room-1-btn-collision', () => this.openChallengeGame(this.data.room, 4));
       this.add.existing(this.challengeFour)  

       this.createCustomTextButton(this.cameras.main.centerX , this.cameras.main.centerY + 800, () => this.nextRoom()); 
       this.createLabel('Next Room', this.cameras.main.centerX , this.cameras.main.centerY  + 800)
 
       this.createLabel('Room: ' + this.data.room  , this.cameras.main.centerX , this.cameras.main.centerY  - 900, '90px', 'white')
    }
 

   createLabel(text, x, y, size = '42px', color='red')
   { 
       this.add.text(x, y, text, {
           fontSize: size,
           color: color, // or '#ff0000' 
            fontStyle: 'bold'
       }).setOrigin(.5);
   }

   createCustomTextButton(x,y, met)
   {  
       this.continueBtn = new ImgButton(this, x, y, 'blank-btn-round', () => met());
       this.add.existing(this.continueBtn)  
   }

   displayInfo()
   { 
        this.clickAudio.play();
        this.scene.run(CST.SCENES.ROOMINFO, this.data);
        this.scene.bringToTop(CST.SCENES.ROOMINFO); 
   }

   nextRoom()
   {
        this.clickAudio.play();
        const room = this.data.room;
        const completedChallenges = GameData.ROOMS[room-1].numberOfChallengesCompleted;
        if(completedChallenges < 4){
            const message = {
                room: this.data.room,
                success: true, // just to hide the retry button
                gameOver: false,
                message:{title: 'Next Room is Locked.', body:  'Complete all challenges to unlock next Room.'}
            }  
            this.showScene(CST.SCENES.INFORMATION, message ) 
        }else{ 
            this.scene.restart( {room: 2, challenge: 1} )
        }
   }


   openChallengeGame(room=1, challenge=1){
       
        this.clickAudio.play();

        const isChallegeCompleted = GameData.ROOMS[room-1].challenges[challenge-1].completed;
        const sceneGameToLoad = GameData.ROOMS[room-1].challenges[challenge-1].scene;
        const lives =  GameData.ROOMS[room-1].lives;
  
        const data = {lives: lives, room: room, challenge: challenge}

        console.log('Open Challenge', room, challenge, isChallegeCompleted, sceneGameToLoad, lives)

        if(lives == 0 || lives <=-2)
        {
            const message = {
                room: this.data.room,
                success: false,
                gameOver: true,
                message:{title: GameData.GENERAL.gameoverTitle, body:  GameData.GENERAL.gameoverBody}
            }  
            this.showScene(CST.SCENES.INFORMATION, message ) 
        }else{
            if(!isChallegeCompleted ){
                this.showScene(sceneGameToLoad, data) 
             }else{ 
                 const completed = GameData.ROOMS[this.data.room - 1].numberOfChallengesCompleted;
                 const total = GameData.ROOMS[this.data.room - 1].numberOfChallenges;
      
                 const message = {
                     room: this.data.room,
                     success: true,
                     gameOver: false,
                     message:{title: GameData.GENERAL.challengeCompletedText, body:  GameData.ROOMS[room - 1].challenges[challenge -1].successBody(completed,total)}
                 }  
                 this.showScene(CST.SCENES.INFORMATION, message ) 
             }
        } 
   }

   showScene(scene, data)
   {
        this.scene.run(scene, data);
        this.scene.bringToTop(scene); 
   }
}
