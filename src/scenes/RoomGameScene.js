import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js" 
import { Helper } from './Helper.js'; 
import { GameData } from "./GameData.js";


export class RoomGameScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.ROOMGAME})  
    }   

    init(){ 
        this.room = 1;
        this.styleTitle =    { fontFamily: 'Montserrat', fontSize: 54, fill: '#ffffff', align: 'center',fontStyle: 'bold' }    
        this.styleBody =    { fontFamily: 'Montserrat', fontSize: 50, fill: '#ffffff', align: 'center',fontStyle: 'bold', wordWrap: {  width: 900,  useAdvancedWrap: true }, }    
    }
    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 

         
        this.challengeOne()
        
    } 
      

      

    challengeOne() {
        this.gridRows = 2;
        this.gridCols = 3;
        this.tileSize = 180;
         this.offsetX = this.cameras.main.centerX -200; // Starting x position
        this.offsetY = this.cameras.main.centerY - 200 ; // Starting y position
        this.padding = 30;
       
    
        this.symbolKeys = ['r1-c1-1', 'r1-c1-2', 'r1-c1-3', 'r1-c1-4', 'r1-c1-5', 'r1-c1-6'];
        this.correctOrder = [...this.symbolKeys]; // For validation
        this.tiles = [];

        const shuffledSymbols = Phaser.Utils.Array.Shuffle([...this.symbolKeys]);
        this.correctOrder = Phaser.Utils.Array.Shuffle([...this.symbolKeys]);
 
        console.log('Correct Order: ', this.correctOrder)

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
    
                tile.on('pointerdown', () => this.handleTileClick(tile));
    
                this.tiles.push(tile); // store in grid order
                
    
                i++;
            }
        }
    }
    
    handleTileClick(tile) {
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

    swapTiles(tileA, tileB) {
        

        const tempKey = tileA.texture.key;
        tileA.setTexture(tileB.texture.key);
        tileB.setTexture(tempKey);

        const tempSymbol = tileA.symbolKey;
        tileA.symbolKey = tileB.symbolKey;
        tileB.symbolKey = tempSymbol;

        this.time.delayedCall(150, () => this.resetSelection());

        const currentPattern = this.tiles.map(tile => tile.symbolKey);
        console.log('🧩 Current Pattern:', currentPattern);

        this.checkPattern();
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

        if (isCorrect) {
            console.log('✅ Puzzle Solved!');
            // Trigger portal repair, scene change, etc.
        }
    }

    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'room-1-game-bg').setOrigin(.5); 
        this.pageBg.setInteractive()
        

        this.add.text(this.cameras.main.centerX,   200, GameData.ROOMS[this.room - 1].challenges[this.room -1].name, this.styleTitle).setOrigin(0.5).setDepth(999)
        this.add.text(this.cameras.main.centerX, 400, GameData.ROOMS[this.room - 1].challenges[this.room -1].description, this.styleBody).setOrigin(0.5).setDepth(999)

        this.closeBtn = new ImgButton(this, this.cameras.main.centerX + 470,  80, 'close-btn-round', () => this.closePage());
        this.add.existing(this.closeBtn)  


        this.startBtn = new ImgButton(this,  this.cameras.main.centerX, this.cameras.main.centerY + 440, 'start-btn-general', () => this.startGame(this.room));
        this.add.existing(this.startBtn)  
 
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
