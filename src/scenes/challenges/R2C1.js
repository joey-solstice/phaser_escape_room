import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R2C1 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R2C1})  
    }   

    init(data){
        this.data = data;
        this.data.message = {title:"", body:""} 
 
 

        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold' }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);

        this.movesLeft =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves; 
        this.unlimitedMoves = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].unlimitedMoves; 

        this.livesUpdated = false; // we update lives(retries per room) when player do a move 
 
        this.displayAssets();  
        this.challengeOne();
    } 
      

      

    challengeOne() { 
       
        this.directions = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
        this.invertedMap = {
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
            UP: 'DOWN',
            DOWN: 'UP'
        };

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        // Instruction text
        this.instructionText = this.add.text(this.centerX, 100, '', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Placeholder for buttons
        this.buttons = [];

        this.showInstruction();
         
    }


    showInstruction() {
        // Pick random instruction
        this.currentInstruction = Phaser.Utils.Array.GetRandom(this.directions);
        this.instructionText.setText(this.currentInstruction);

        // Clear existing buttons
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];

        // Shuffle directions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.directions]);

        // Create buttons in a row (spaced evenly)
        const startX = this.centerX - 180;
        shuffled.forEach((dir, index) => {
            const x = startX + index * 120;
            const btn = this.add.image(x, this.centerY, dir.toLowerCase() + "-btn").setInteractive().setScale(1);
            btn.on('pointerdown', () => this.checkInput(dir));
            this.buttons.push(btn);
        });
    }

    checkInput(selectedDirection) {
        const correctDirection = this.invertedMap[this.currentInstruction];
        if (selectedDirection === correctDirection) {
            console.log(`✅ Correct! Instruction: ${this.currentInstruction}, You pressed: ${selectedDirection}`);
            this.showInstruction(); // Next round
        } else {
            console.log(`❌ Wrong! Instruction: ${this.currentInstruction}, You pressed: ${selectedDirection}`);
            this.scene.restart(); // Wrong! Reset the scene
        }
    }
     
    
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

    swapTiles(tileA, tileB) {
        

        const tempKey = tileA.texture.key;
        tileA.setTexture(tileB.texture.key);
        tileB.setTexture(tempKey);

        const tempSymbol = tileA.symbolKey;
        tileA.symbolKey = tileB.symbolKey;
        tileB.symbolKey = tempSymbol;

        this.time.delayedCall(150, () => this.resetSelection());

        const currentPattern = this.tiles.map(tile => tile.symbolKey);
        
        
        this.updateMovesLeft();
        
        this.updateMoveLabel();
        this.checkPattern();
        this.updateCorrectOutlines();
        this.checkOutOfMoves();
    }

    updateMovesLeft()
    { 
        console.log('Is unli',this.unlimitedMoves);
        if(this.unlimitedMoves) return; 
        this.movesLeft--;
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
    updateMoveLabel()
    {
        this.moveLabel.setText( "Moves: " + this.movesLeft );
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

    checkPattern() {
       
        let isCorrect = true;
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].symbolKey !== this.correctOrder[i]) {
                isCorrect = false;
                break;
            }
        }
 
        // GAME IS COMPLETTED SUCCESS
        if (isCorrect) { 
            this.setCompletedChallenge(); 
            GameData.ROOMS[this.data.room-1].challenges[this.data.challenge-1].completed = true;

            this.closePage();
              
            this.setInfoMessage(true); 
            this.showInfoMessage(true);
        }
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
        const data = {success:success, message : this.data.message, fromScene: CST.SCENES.R1C1, room: this.data.room}
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
 
        this.moveLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 400, "Moves: "+ this.movesLeft, this.styleBody).setOrigin(0.5).setDepth(999)


        // this.closeBtn = new ImgButton(this, this.cameras.main.centerX + 470,  80, 'close-btn-round', () => this.closePage());
        // this.add.existing(this.closeBtn)  

        
    }  
    startGame(challenge = 1)
    {
        this.startBtn.setVisible(false);
    }
    closePage()
    { 
        this.scene.stop(CST.SCENES.R1C1);
    }
}
