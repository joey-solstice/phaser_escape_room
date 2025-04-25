import { CST } from "../CST.js"; 
import { ITL } from "./ITL.js"; //   Images To Load.
import { GameData } from "./GameData.js" 

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.LOAD })
    }

    user_id

   

    preload() { 
        
        this.Audio(); 
        Object.values(ITL).forEach(group => {
            group.forEach(asset => { 
              //  console.log(asset.url)
                this.load.image(asset.key, asset.url);
            });
        });

        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg-preload').setOrigin(.5)
        this.loadingbar2 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'loading-bar').setOrigin(0, 0).setScale(.5).setVisible(false)
        this.loadingbg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 5.5 - 180, 'bg-loading').setOrigin(0.5, 0).setScale(.5)
        this.loadingbar = this.add.image(this.cameras.main.centerX - this.loadingbar2.displayWidth/2, this.cameras.main.centerY - 180  , 'loading-bar').setOrigin(0, 0).setScale(.5)
        
        this.loadingbar.scaleX = .01

        this.load.on('progress', function (value) {
            let v = parseInt(value * 50);  
            this.scene.loadingbar.scaleX = v/100 
        });   

        this.load.on('complete', function () {});  
    }

    create() 
    {   
        let sc = CST.SCENES.HOME;
        let data = {}
        if(this.isDev() === false){ 
            data = {room: 1, challenge: 1} 
        }else{
            data = {
                room: 1,
                success: true,
                message:{title: GameData.GENERAL.challengeCompletedText, body:  GameData.ROOMS[0].challenges[0].successBody(4,4)}
            }
            sc = CST.SCENES.INFORMATION;
        }


        console.log('data', data)
        this.scene.start(sc, data )  // 
 
    }
    isDev()
    {
        const urlParams = new URLSearchParams(window.location.search);
        const isd = urlParams.get('dev') === '1';
        console.log('On Dev:', isd)
        return isd;
    }

    Audio(){ 
        this.load.audio('click', './assets/audio/click.mp3');
        this.load.audio('congrats', './assets/audio/levelup.mp3');
        this.load.audio('popup', './assets/audio/popup.mp3');
        this.load.audio('error', './assets/audio/error.mp3');
        this.load.audio('distorted-audio-1', './assets/audio/room1/challenge2/audio1.mp3');
    }


}