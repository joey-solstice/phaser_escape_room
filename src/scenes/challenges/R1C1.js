import { CST } from "../../CST.js" 
import { ImgButton } from "../../prefabs/ImgButton.js" 
import { Helper } from '../Helper.js'; 
import { GameData } from "../GameData.js";


export class R1C1 extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.R1C1})  
    }   

    init(data){
        this.data = data;
        this.data.message = {title:"", body:""} 
 

        console.log(this.data)
 

        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold' }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 

         
        this.challengeOne()
        
    } 
      

      

    challengeOne() { 
        this.movesLeft = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].moves;

        this.gridRows = 3;
        this.gridCols = 3;
        this.tileSize = 180;
         this.offsetX = this.cameras.main.centerX -200; // Starting x position
        this.offsetY = this.cameras.main.centerY - 200 ; // Starting y position
        this.padding = 30;
       
    
        this.symbolKeys = ['r1-c1-1', 'r1-c1-2', 'r1-c1-3', 'r1-c1-4', 'r1-c1-5', 'r1-c1-6', 'r1-c1-7', 'r1-c1-8', 'r1-c1-9', ];
    
        this.tiles = [];
            
        // 2. Shuffle once to get the STARTING layout
        const shuffledSymbols = Phaser.Utils.Array.Shuffle([...this.symbolKeys]);
        
        // 3. Rotate the array N steps to get the CORRECT solution
        function rotateArray(arr, steps) {
            const len = arr.length;
            steps = steps % len;
            return arr.slice(steps).concat(arr.slice(0, steps));
        }
        
        // You can rotate any amount, e.g. 3 steps:
        const correctOrder = rotateArray(shuffledSymbols, 3);
          
        // 4. Store them
        this.correctOrder = shuffledSymbols// correctOrder;

        // console.log('Start Order: ',  shuffledSymbols)
        // console.log('Correct Order: ', this.correctOrder)

        this.selectedTile = null;
        this.secondTile = null;

        this.buildGrid(shuffledSymbols);
    }

    
    buildGrid(symbols) {
        let i = 0;
    
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                const x = this.offsetX + col * (this.tileSize + this.padding);
                const y = this.offsetY + row * (this.tileSize + this.padding);
    
                const symbolKey = symbols[i];
    
                const tile = this.add.image(x, y, symbolKey).setInteractive();
                tile.setDisplaySize(this.tileSize, this.tileSize);
                tile.symbolKey = symbolKey;
                tile.gridIndex = i;

                const outline = this.add.graphics();
                outline.lineStyle(4, 0xffff00); // yellow border, 4px
                outline.strokeRect(
                    tile.x - this.tileSize / 2,
                    tile.y - this.tileSize / 2,
                    this.tileSize,
                    this.tileSize
                );
                outline.setVisible(false);
                tile.outline = outline;


                // ✅ Correct position outline (green)
                const correctOutline = this.add.graphics();
                correctOutline.lineStyle(3, 0x00ff00); // green border
                correctOutline.strokeRect(
                    tile.x - this.tileSize / 2,
                    tile.y - this.tileSize / 2,
                    this.tileSize,
                    this.tileSize
                );
                correctOutline.setVisible(false);
                tile.correctOutline = correctOutline;
    
                tile.on('pointerdown', () => this.handleTileClick(tile));
    
                this.tiles.push(tile); // store in grid order
                
    
                i++;
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

    handleTileClick(tile) {
        
        if(this.movesLeft <=0){
            // show no more move left
            return;
        }
        if (!this.selectedTile) {
            this.selectedTile = tile; 
            tile.outline.setVisible(true); // Highlight first tile
        } else if (!this.secondTile && tile !== this.selectedTile) {
            this.secondTile = tile;
            tile.outline.setVisible(true); // Highlight second tile

            this.swapTiles(this.selectedTile, this.secondTile);
        } else {
            this.resetSelection();
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
         
        this.movesLeft--;
        
        this.updateMoveLabel();
        this.checkPattern();
        this.updateCorrectOutlines();
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
            this.data.message.title = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].successTitle;
            this.data.message.body  = GameData.ROOMS[this.data.room - 1].challenges[this.data.challenge -1].successBody;
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

        const moveLeft = this.movesLeft !== undefined ? this.movesLeft : 20; 
        this.moveLabel = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 400, "Moves: "+ moveLeft, this.styleBody).setOrigin(0.5).setDepth(999)


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
