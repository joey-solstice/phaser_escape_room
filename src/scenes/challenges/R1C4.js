import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R1C4 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R1C4})  
    }   

    init(data){
        this.data = data;
        console.log(this.data)
        this.data.message = {title:"", body:""} 
       
        this.getGameData();
  
        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
        this.styleCode =    { fontFamily: 'Montserrat', fontSize: 90, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);
        this.livesUpdated = false;
        this.displayAssets();  
        this.challengeGame()   
 
        this.clickAudio = this.sound.add('click');
        this.errorAudio = this.sound.add('error'); 
        this.congratsAudio = this.sound.add('congrats'); 
    } 

    getGameData()
    {
        this.movesLeft =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves;  
        this.unlimitedMoves = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].unlimitedMoves; 
    } 
 
     
    challengeGame() { 
        this.riddle = "What has keys but can't open locks?";
        this.answer = "PIANO"; // Correct answer (uppercase) 
        this.clickedLetters = [];

        this.maxMistakes = 6;
        this.mistakes = 0;
 
        this.riddleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 300, this.riddle, {
            fontSize: '50px',
            color: '#ffffaa',
            wordWrap: { width: 600, useAdvancedWrap: true },
            align: 'center'
        }).setOrigin(0.5);

        this.answerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, '', {
            fontSize: '52px',
            color: '#00ffcc',
            letterSpacing: 4
        }).setOrigin(0.5);

        this.statusText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, '', {
            fontSize: '54px',
            color: '#00ff00',
            wordWrap: { width: 900, useAdvancedWrap: true },
        }).setOrigin(0.5);
 
        this.createLetterButtons();
    } 
     
    updateAnswerDisplay() {
        const display = this.answer
            .split('')
            .map(letter => (this.clickedLetters.includes(letter) ? letter : '_'))
            .join(' ');

        this.answerText.setText(display);
    }

    createLetterButtons() {
        const uniqueAnswerLetters = [...new Set(this.answer.split(''))];
        const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            .split('')
            .filter(l => !uniqueAnswerLetters.includes(l));

        Phaser.Utils.Array.Shuffle(extraLetters);
        const chosenExtras = extraLetters.slice(0, 12 - uniqueAnswerLetters.length);

        const combinedLetters = Phaser.Utils.Array.Shuffle([...uniqueAnswerLetters, ...chosenExtras]);


        const startX = this.cameras.main.centerX - 300;
        const startY =  this.cameras.main.centerY + 100;
        const spacing = 110;

        combinedLetters.forEach((letter, i) => {
            const x = startX + (i % 6) * spacing;
            const y = startY + Math.floor(i / 6) * (spacing + 50);

            const btn = this.add.text(x, y, letter, {
                fontSize: '60px',
                backgroundColor: '#444444',
                color: '#ffffff',
                padding: { x: 30, y: 30 },
                fixedWidth: 100,
                align: 'center'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => this.handleLetterClick(letter, btn));
        });
    }

    handleLetterClick(letter, btn) {
        this.clickAudio.play();

        //btn.disableInteractive();
        this.clickedLetters.push(letter);

        const display = this.clickedLetters.join('');
        this.answerText.setText(display);

        if (this.clickedLetters.length === this.answer.length) {
            if (display === this.answer) {
                this.statusText.setText('✅ You solved the riddle!');
               
                GameData.ROOMS[this.data.room-1].challenges[this.data.challenge-1].completed = true;

                this.setCompletedChallenge(); 
                this.closePage(); 
                this.setInfoMessage(true); 
                this.showInfoMessage(true);
                this.congratsAudio.play()
            } else { 
                this.answerText.setText('');
                this.clickedLetters = [];
                this.updateMovesLeft()
                this.updateMoveLabel();
                this.checkOutOfMoves();
                this.errorAudio.play()
            }
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

    showInfoMessage(success = false)
    {
        const data = {success:success, message : this.data.message, fromScene: CST.SCENES.R1C4, room: this.data.room}
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
    startGame(challenge = 1)
    {
        this.startBtn.setVisible(false);
    }
    closePage()
    { 
        this.scene.stop(CST.SCENES.ROOMGAME);
    }
}
