import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R2C4 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R2C4})  
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
        this.t9Map = {
            2: ['A', 'B', 'C'],
            3: ['D', 'E', 'F'],
            4: ['G', 'H', 'I'],
            5: ['J', 'K', 'L'],
            6: ['M', 'N', 'O'],
            7: ['P', 'Q', 'R', 'S'],
            8: ['T', 'U', 'V'],
            9: ['W', 'X', 'Y', 'Z']
          };

        this.score = 0;
        this.maxScore = 3;
        this.timeLimit = 60;

        this.letterButtons = [];
        this.currentAnswer = [];
        this.userAnswer = [];

        this.timerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 300, '', { fontSize: '74px', color: '#fff' }).setOrigin(0.5);
        this.cipherText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, '', { fontSize: '78px', color: '#ff0' }).setOrigin(0.5);
        this.scoreText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 400, 'Score: 0', { fontSize: '54px', color: '#0f0' }).setOrigin(0.5);

        this.createLetterButtons();
        this.generateCipher();
        this.startTimer();
    } 

    createLetterButtons() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let x = 140, y = this.cameras.main.centerY - 100;
        [...letters].forEach((letter, i) => {
            const btn = this.add.text(x, y, letter, {
            fontSize: '42px', backgroundColor: '#222', padding: 30, color: '#fff'
            }).setInteractive();

            btn.on('pointerdown', () => this.handleLetterClick(letter));
            this.letterButtons.push(btn);

            x += 100;
            if ((i + 1) % 8 === 0) {
                x = 140;
                y += 110;
            }
        });
    }

    generateCipher() {
        this.userAnswer = [];
        this.currentAnswer = [];
        this.currentCipher = [];

        for (let i = 0; i < 3; i++) {
            const key = Phaser.Math.Between(2, 9);
            const chars = this.t9Map[key];
            const press = Phaser.Math.Between(1, chars.length);
            const letter = chars[press - 1];
            this.currentAnswer.push(letter);
            this.currentCipher.push(`${key}${press}`);
        }

        this.updateCipherDisplay();
    }

    handleLetterClick(letter) {
        this.userAnswer.push(letter);
        if (this.userAnswer.length === 3) {
            this.validateAnswer();
        }
    }

    updateCipherDisplay() {
        let display = this.currentCipher.map((c, i) => this.userAnswer[i] || c).join(' ');
        this.cipherText.setText(`Cipher: ${display}`);
      }
    
      handleLetterClick(letter) {
        this.clickAudio.play();
        this.userAnswer.push(letter);
        this.updateCipherDisplay();
        if (this.userAnswer.length === 3) {
          this.validateAnswer();
        }
      }

    validateAnswer() {
        if (this.userAnswer.join('') === this.currentAnswer.join('')) {
            this.score++;
            if (this.score >= this.maxScore) {
                this.scoreText.setText('✔ You Win!');
                this.time.delayedCall(500, () => this.challegeCompletted());
                return;
            } else {
                this.scoreText.setText(`Score: ${this.score}`);
                this.generateCipher();
                this.resetTimer();
            }
        } else {
            this.errorAudio.play();
            this.score = 0;
            this.scoreText.setText('❌ Wrong! Back to 0');
            this.time.delayedCall(1500, () => this.scene.restart());
        }
    }

    startTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeLimit--;
                this.timerText.setText(`Time: ${this.timeLimit}s`);

                if (this.timeLimit <= 0) {
                    this.score = 0;
                    this.scoreText.setText(`⏰ Time's up! Back to 0`);
                    this.time.delayedCall(1500, () => this.scene.restart());
                }
            }
        });
    }

    resetTimer() {
        this.timeLimit = 60;
        this.timerText.setText(`Time: ${this.timeLimit}s`);
    }

    //
      
    checkOutOfMoves()
    { 
        const outOfMoves = this.movesLeft > 0 ? false:true;
        if(outOfMoves){          
            this.updateLives(false);
            this.closePage(); 
            this.setInfoMessage(false); 
            this.showInfoMessage(false);
        }
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


    arraysAreEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
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

    resetSelection() {
        if (this.selectedTile) this.selectedTile.outline.setVisible(false);
         if (this.secondTile) this.secondTile.outline.setVisible(false);
        this.selectedTile = null;
        this.secondTile = null;
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
        this.scene.stop(CST.SCENES.R2C4);
    }
}
