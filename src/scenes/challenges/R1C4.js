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
        this.audioControl()

        this.passAudio = this.sound.add('distorted-audio-1');
     
    } 

    getGameData()
    {
        this.movesLeft =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves;  

    }
      
    audioControl()
    {
        const playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 280, '▶ Play Audio', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();
        
        playButton.on('pointerdown', () => {
            this.passAudio.play();
        });
    }
 
    updateMoveLabel()
    {
        this.moveLabel.setText( this.moveName + ": " + this.movesLeft );
    }
    
    challengeGame() { 
        const gridRows = 3;
        const gridCols = 3;
        const tileSize = 150;
        const offsetX = this.cameras.main.centerX -150; // Starting x position
        const offsetY = this.cameras.main.centerY; // Starting y position
        const padding = 10;
    
        let number = 1;
        const tiles = [];
        
        //Seven... One... Three... Five... Two... Eight...

       this.correct = [7,1,3,5,2,8]
      // this.correct = [1,2,3,4,5,6]
       this.dialed = [];
    
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const x = offsetX + col * (tileSize + padding);
                const y = offsetY + row * (tileSize + padding);
    
                // Create a background rectangle
                const rect = this.add.rectangle(0, 0, tileSize, tileSize, 0x444444);
                rect.setStrokeStyle(2, 0xffffff);
    
                // Create the text
                const text = this.add.text(0, 0, number.toString(), {
                    fontSize: '46px',
                    fontFamily: 'monospace',
                    color: '#ffffff',
                }).setOrigin(0.5);
    
                // Put them together in a container
                const tile = this.add.container(x, y, [rect, text])
                    .setSize(tileSize, tileSize)
                    .setInteractive(new Phaser.Geom.Rectangle(0, 0, tileSize, tileSize), Phaser.Geom.Rectangle.Contains);
    
                tile.number = number;
                tile.gridIndex = tiles.length;
    
                tile.on('pointerdown', () => { 
                    rect.setFillStyle( 0x555555);   
                });

                tile.on('pointerup', () => { 
                    this.dialed.push(tile.number)
                    rect.setFillStyle( 0x444444);  
                   
                    // 👁️ Build visible + masked code
                    let visible = this.dialed.join('');            // e.g. "123"
                    let masked = visible.padEnd(6, '*');            // e.g. "123***"

                    // Set to label
                    this.codeLabel.setText(masked);

                    if(this.dialed.length >=6){
                        this.checkPattern(); 
                    }
                
                });
    
                tiles.push(tile);
                number++;
            }
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

    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'room-1-game-bg').setOrigin(.5); 
        this.pageBg.setInteractive()
        

        const messageTitle = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].name;
        const messageBody  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].description

        this.add.text(this.cameras.main.centerX, 200, messageTitle, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, 400, messageBody, this.styleBody).setOrigin(0.5).setDepth(999)
 
        this.moveName =  GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].movesName;

        this.moveLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 500, this.moveName + ": " + this.movesLeft, this.styleBody).setOrigin(0.5).setDepth(999)


        this.codeLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 140, "*******", this.styleCode).setOrigin(0.5).setDepth(999)

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
