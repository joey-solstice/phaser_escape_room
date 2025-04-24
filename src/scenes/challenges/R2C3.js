import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R2C3 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R2C3})  
    }   

    init(data){
        this.data = data;
        this.data.message = {title:"", body:""} 
  
        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold' }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);
        
        this.getGameData();

        this.livesUpdated = false; // we update lives(retries per room) when player do a move 
        
        this.congratsAudio  = this.sound.add('congrats');
        this.clickAudio = this.sound.add('click');
        this.errorAudio = this.sound.add('error'); 

        this.displayAssets();  
        this.challengeOne();
 
    } 
      
    getGameData()
    {
        this.movesLeft =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves;  
        this.unlimitedMoves = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].unlimitedMoves; 
    }
      
 
    
    challengeOne() { 
 

        this.colors = [
            0xff0000, 0x00ff00, 0x0000ff,
            0xffff00, 0xff00ff, 0x00ffff,
            0xffffff, 0x888888, 0xff8800,
            0x8800ff, 0x00ff88, 0x8888ff
          ];
        this.level = 1;
        this.maxLevel = 3;
        this.sequence = [];
        this.userChoices = [];
         
        this.instructionText = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 250, '', {
        fontSize: '50px', color: '#00ffff',
        align: 'center',
        wordWrap: {  width: 900,  useAdvancedWrap: true }
        }).setOrigin(0.5);
    
        this.generateSequence();
    } 
  
    resetScore()
    {
        this.score = 0;
    }
 
    updateLives(increase = false)
    {
        if(this.livesUpdated) return;

        this.livesUpdated = true;
        const mainGame = this.scene.get(CST.SCENES.GAME);
        mainGame.updateLives(increase);  
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
 
    updateMovesLeft()
    {  
        if(this.unlimitedMoves) return; 
        this.movesLeft--;
    }

    updateMoveLabel()  
    {
        if(this.unlimitedMoves) return;
        this.moveLabel.setText( this.moveName + ": " + this.movesLeft );
    }

    checkOutOfMoves()
    { 
        console.log('Moves Left', this.movesLeft)
        const outOfMoves = this.movesLeft > 0 ? false:true;
        if(outOfMoves){          
            this.updateLives(false);
            this.closePage(); 
            this.setInfoMessage(false); 
            this.showInfoMessage(false);
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
            //console.log(this.data.message.body)
        } 
    }

    showInfoMessage(success = false)
    {
        const data = {success:success, message : this.data.message, fromScene: CST.SCENES.R2C1, room: this.data.room}
        this.scene.run(CST.SCENES.INFORMATION, data);
        this.scene.bringToTop(CST.SCENES.INFORMATION);
    }

    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'room-1-game-bg').setOrigin(.5); 
        this.pageBg.setInteractive()
        

        const messageTitle = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].name;
        const messageBody  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].description

        this.add.text(this.cameras.main.centerX, 200, messageTitle, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, 400, messageBody, this.styleBody).setOrigin(0.5).setDepth(999)
 
        this.moveName =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].movesName;

        if(this.unlimitedMoves == false){
            this.moveLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 500, this.moveName + ": " + this.movesLeft, this.styleBody).setOrigin(0.5).setDepth(999)
        }

        this.closeBtn = new ImgButton(this, this.cameras.main.centerX + 470,  80, 'close-btn-round', () => this.closePage());
        this.add.existing(this.closeBtn)  

        
    }  

    challegeCompletted()
    {
        this.setCompletedChallenge();
        GameData.ROOMS[this.data.room-1].challenges[this.data.challenge-1].completed = true;
        this.resetScore();
        this.closePage(); 
        this.setInfoMessage(true); 
        this.showInfoMessage(true); 
        this.congratsAudio.play(); 
    }
    startGame(challenge = 1)
    {
        this.startBtn.setVisible(false);
    }
    closePage()
    { 
        this.scene.stop(CST.SCENES.R2C3);
    }


    // GAME CODE

    generateSequence() {
        this.sequence = Phaser.Utils.Array.Shuffle([...this.colors]).slice(0, 1 + this.level);
        this.instructionText.setText(`Level ${this.level}: Memorize these colors`);
        this.showSequence(0);
    }
    
      showSequence(index) {
        if (index >= this.sequence.length) {
          this.time.delayedCall(1000, () => this.showChoices());
          return;
        }
    
        const color = this.sequence[index];
        const box = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY - 100, 100, 100, color).setOrigin(0.5);
    
        this.time.delayedCall(1500, () => {
          box.destroy();
          this.showSequence(index + 1);
        });
      }
    
      showChoices() {
        this.instructionText.setText('Select the colors you saw');
        this.userChoices = [];
        this.choiceBoxes = [];
        const shuffledColors = Phaser.Utils.Array.Shuffle([...this.colors]);
        let x = 200, y = this.cameras.main.centerY ;
    
        shuffledColors.slice(0, 12).forEach((color, index) => {
          const box = this.add.rectangle(x, y, 120, 120, color).setInteractive();
          box.colorValue = color;
    
          box.on('pointerdown', () => this.handleChoice(box));
    
          this.choiceBoxes.push(box);
          x += 140;
          if ((index + 1) % 6 === 0) {
            x = 200;
            y += 140;
          }
        });
    
        this.startAnswerTimer();
      }
    
      handleChoice(box) {
        if (this.userChoices.includes(box.colorValue)) return; // avoid duplicate
        this.userChoices.push(box.colorValue);
        box.setStrokeStyle(4, 0xffffff);
    
        if (this.userChoices.length === this.sequence.length) {
          this.validateChoices();
        }
      }
    
      validateChoices() {
        const correct = this.sequence.every(color => this.userChoices.includes(color));
        if (correct) {
          this.instructionText.setText('✅ Correct!'); 
          
          this.resetRound(true);

        } else {
          this.instructionText.setText('❌ Wrong!'); 
          this.updateMovesLeft(); 
          this.updateMoveLabel(); 
          this.checkOutOfMoves();
          this.resetScore();
          this.errorAudio.play(); 
          this.resetRound();
        }
      }
    
      startAnswerTimer() {
        
      }

      resetRound(correct) {

        if(this.level >= this.maxLevel)
        {
          this.challegeCompletted();
          return;
        }
        // Clear previous boxes
        if (this.choiceBoxes) {
          this.choiceBoxes.forEach(box => box.destroy());
        }
      
         // ✅ Cancel existing timer if still active
        if (this.timer) {
            this.timer.remove(false);
        }

        if (correct) {
          this.level = Math.min(this.level + 1, this.maxLevel);
        } else {
          this.level = 1;
        }
      
        this.time.delayedCall(1000, () => {
          this.generateSequence();
        });
      }
}
