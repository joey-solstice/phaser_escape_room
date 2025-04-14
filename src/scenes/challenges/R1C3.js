import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R1C3 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R1C3})  
    }   

    init(data){
        this.data = data;
        this.data.message = {title:"", body:""} 
       
        this.getGameData();
  
        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleCode =    { fontFamily: 'Montserrat', fontSize: 90, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 

         
        this.challengeGame() 
 
     
    } 

    getGameData()
    {
        this.movesLeft =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves;  

    }
      
     
 
    updateMoveLabel()
    {
        this.moveLabel.setText( this.moveName + ": " + this.movesLeft );
    }
    
    challengeGame() {  
        this.stopGeneratePortalColor = false;
 
        this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // red, green, blue, yellow in hex
        this.colorNames = ['red', 'green', 'blue', 'yellow']; // for label use
        this.targetColor = null;
        this.currentPortalColor = null;
        this.syncCount = 0;
        this.totalSyncs = 4;

        this.colorText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 300, '', {
            fontSize: '48px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.targetText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, '', {
            fontSize: '44px',
            color: '#00ffcc',
        }).setOrigin(0.5);

        this.statusText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, '', {
            fontSize: '44px',
            color: '#00ff00',
        }).setOrigin(0.5);

        //this.syncSound = this.sound.add('syncSuccess');

        this.createColorButtons();
        this.startNewTarget();

        // Update the portal color every second
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.updatePortalColor();
            }
        });
    }

    createColorButtons() {
        this.colorButtons = [];
        const radius = 80;

        this.colors.forEach((colorValue, i) => {
            const x = (this.cameras.main.centerX - 290) + i * 200;
            const y = this.cameras.main.centerY + 100;

            const circle = this.add.circle(x, y, radius, colorValue)
                .setInteractive({ useHandCursor: true });

            circle.on('pointerdown', () => this.handleColorClick(this.colorNames[i]));
            this.colorButtons.push(circle);
        });
    }

    updatePortalColor() {
        if (this.stopGeneratePortalColor)  return;
        const index = Phaser.Math.Between(0, this.colorNames.length - 1);
        this.currentPortalColor = this.colorNames[index];
        this.colorText.setText(`Portal Color: ${this.currentPortalColor.toUpperCase()}`);
    }

    startNewTarget() {
        let newColor;
        do {
            const index = Phaser.Math.Between(0, this.colorNames.length - 1);
            newColor = this.colorNames[index];
        } while (newColor === this.currentPortalColor);
    
        this.targetColor = newColor;
        this.targetText.setText(`Synchronize: ${this.targetColor.toUpperCase()}`);
    }

    handleColorClick(clickedColor) {
        if (clickedColor === this.targetColor && clickedColor === this.currentPortalColor) {
            this.syncCount++;
            this.statusText.setText(`✅ Synced ${this.syncCount}/${this.totalSyncs}`);
         
            if (this.syncCount >= this.totalSyncs) {
                this.setCompletedChallenge();
                GameData.ROOMS[this.data.room-1].challenges[this.data.challenge-1].completed = true;
                
                this.closePage(); 
                this.setInfoMessage(true); 
                this.showInfoMessage(true); 

            } else {
                this.startNewTarget();
            }
        } else {
            this.statusText.setText('❌ Incorrect timing!');
        
            this.movesLeft--;
            this.updateMoveLabel();
            this.checkOutOfMoves(); 
        }
    }

    setCompletedChallenge()
    {
        GameData.ROOMS[this.data.room - 1].numberOfChallengesCompleted += 1;
    }
    setInfoMessage(success = false)
    {
        const completed = GameData.ROOMS[this.data.room - 1].numberOfChallengesCompleted;
        const total = GameData.ROOMS[this.data.room - 1].numberOfChallenges;

        if(success){
            this.data.message.title = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].successTitle;
            this.data.message.body  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].successBody(completed,total);
        }else{
            this.data.message.title = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].gameoverTitle;
            this.data.message.body  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].gameoverBody;
        } 
    }

    showInfoMessage(success = false)
    {
        const data = {success:success, message : this.data.message}
        this.scene.run(CST.SCENES.INFORMATION, data);
        this.scene.bringToTop(CST.SCENES.INFORMATION);
    }

    //=========

    updateCorrectOutlines() {
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            const expectedKey = this.correctOrder[i];
    
            if (tile.symbolKey === expectedKey) {
                tile.correctOutline.setVisible(true);
            } else {
                tile.correctOutline.setVisible(false);
            }
        }
    } 

    checkArrayIfSame(arr1, arr2)
    {
        if (arr1.length !== arr2.length) return false;

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    checkOutOfMoves()
    {
        const outOfMoves = this.movesLeft > 0 ? false:true;
        if(outOfMoves){  
            this.closePage(); 
            this.setInfoMessage(false); 
            this.showInfoMessage(false);
        }
    }
    checkPattern() { 

        const isCorrect = this.checkArrayIfSame(this.correct, this.dialed)
      
       
        if (isCorrect) {  
            GameData.ROOMS[this.data.room-1].challenges[this.data.challenge-1].completed = true;
            this.setCompletedChallenge();

            this.closePage(); 
            this.setInfoMessage(true); 
            this.showInfoMessage(true);
        }else{ 
            this.dialed = [];
            this.codeLabel.setText('******');
            this.movesLeft--;
            this.updateMoveLabel();
            this.checkOutOfMoves();
        }
        

    }
 
    

    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'room-1-game-bg').setOrigin(.5); 
        this.pageBg.setInteractive()
        

        const messageTitle = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].name;
        const messageBody  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].description

        this.add.text(this.cameras.main.centerX, 200, messageTitle, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, 400, messageBody, this.styleBody).setOrigin(0.5).setDepth(999)
 
        this.moveName =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].movesName;

        this.moveLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 500, this.moveName + ": " + this.movesLeft, this.styleBody).setOrigin(0.5).setDepth(999)


      

        this.closeBtn = new ImgButton(this, this.cameras.main.centerX + 470,  80, 'close-btn-round', () => this.closePage());
        this.add.existing(this.closeBtn)  

        
    }  
    startGame(challenge = 1)
    {
        this.startBtn.setVisible(false);
    }
    closePage()
    { 
        this.scene.stop(CST.SCENES.ROOMGAME);
    }
}
