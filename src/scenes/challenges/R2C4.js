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
        this.gridSize = 4;
        this.buttonSize = 150;
        this.buttons = [];
        this.numbers = [];
        this.revealed = [];
        this.matched = [];
        this.firstClick = null;
        this.movesLeft = 30;
        this.inputEnabled = true;
        
        this.generateNumbers();

        const totalGridSize = this.gridSize * this.buttonSize;
        const offsetX = (this.sys.game.config.width - totalGridSize) / 2;
        const offsetY = (this.sys.game.config.height - totalGridSize) / 2;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const x = col * this.buttonSize + offsetX;
                const y = row * this.buttonSize + offsetY;
                const index = row * this.gridSize + col;

                const box = this.add.rectangle(x, y, this.buttonSize - 10, this.buttonSize - 10, 0x999999)
                    .setOrigin(0, 0)
                    .setInteractive();

                const numberText = this.add.text(x + 20, y + 20, '', {
                    font: '44px Arial',
                    color: '#ffffff'
                });

                box.on('pointerdown', () => this.handleBoxClick(index));

                this.buttons.push({ index, box, numberText });
            }
        }
    } 
 
    generateNumbers() {
        this.numbers = [];
        for (let i = 1; i <= 8; i++) {
            this.numbers.push(i);
            this.numbers.push(i);
        }
        Phaser.Utils.Array.Shuffle(this.numbers);
        this.revealed = Array(this.numbers.length).fill(false);
        this.matched = Array(this.numbers.length).fill(false);
    }

    handleBoxClick(index) {
        if (!this.inputEnabled || this.matched[index]) return;

        const currentButton = this.buttons[index];
        currentButton.numberText.setText(this.numbers[index]);

        if (this.firstClick === null) {
            this.firstClick = index;
        } else {
            const previousButton = this.buttons[this.firstClick];

            this.inputEnabled = false;

            if (this.firstClick !== index && this.numbers[this.firstClick] === this.numbers[index]) {
                this.matched[this.firstClick] = true;
                this.matched[index] = true;
                previousButton.box.setFillStyle(0x00cc66);
                currentButton.box.setFillStyle(0x00cc66);
                previousButton.numberText.setText('');
                currentButton.numberText.setText('');
                previousButton.box.disableInteractive();
                currentButton.box.disableInteractive();

                this.time.delayedCall(300, () => {
                    this.inputEnabled = true;
                });
            } else {
                this.time.delayedCall(500, () => {
                    previousButton.numberText.setText('');
                    currentButton.numberText.setText('');
                    this.inputEnabled = true;
                    
                    this.shuffleRemainingNumbers();
                });
            }

            //this.movesLeft--;

            //console.log('ML:',this.movesLeft)
           
             

            if (this.movesLeft <= 0) {
                this.scene.restart();
            } else if (this.matched.every(Boolean)) {
                console.log('complete');
                this.time.delayedCall(500, () => this.challegeCompletted());
            }

            this.firstClick = null;
        }
    }

    shuffleRemainingNumbers() {
        let remaining = [];
        for (let i = 0; i < this.numbers.length; i++) {
            if (!this.matched[i]) {
                remaining.push(this.numbers[i]);
            }
        }
        Phaser.Utils.Array.Shuffle(remaining);

        let rIndex = 0;
        for (let i = 0; i < this.numbers.length; i++) {
            if (!this.matched[i]) {
                this.numbers[i] = remaining[rIndex++];
                this.buttons[i].numberText.setText('');
            }
        }
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
