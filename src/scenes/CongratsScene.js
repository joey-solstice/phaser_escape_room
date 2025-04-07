import { CST } from "../CST.js"
import { Helper } from './Helper.js'; 


export class CongratsScene extends Phaser.Scene {
    
    constructor(data) {
        super({ key: CST.SCENES.CONGRATS });
         
    }   

    init(data) {
         this.data = data; 
 
    }

    create() { 
        this.helper = new Helper(this);
        this.displayAssets(); 
    } 
      
    displayAssets() {
        
        const prizes = [this.data.data];
        const discountPrizes =  prizes.filter(prize => /^\$\d+/.test(prize.prize_name));
       
        
        const bg =   discountPrizes.length > 0 ? 'congratsBg' : 'resultBg';
        const yPos =   discountPrizes.length > 0 ? 920 : 900;
             
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, bg).setOrigin(.5); 
        this.pageBg.setInteractive()

        const text = this.data.data.prize_name;
        this.helper.createResultText(text, '70px', yPos );
    } 
 
    
}
