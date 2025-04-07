import { CST } from "../CST.js";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.LOAD })
    }

    user_id

    preload() {
        this.level = 1
        this.mapLevel = 1 

        //const camH = this.cameras.main.height
        //const camW = this.cameras.main.width  
        
        this.Game() ;
        this.Congrats();
        this.HowTo();
        this.Audio();

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
        this.scene.start(CST.SCENES.GAME)  
    }   

    Game()
    {  
        this.load.image('wheel', './assets/img/scene/game/wheel.png'); 
        this.load.image('wheelBg', './assets/img/scene/game/wheel-bg.png'); 
        this.load.image('wheelPointer', './assets/img/scene/game/wheel-pointer.png'); 
        this.load.image('infoButton', './assets/img/ui/info-btn.png');
        this.load.image('spinButton', './assets/img/ui/spin-btn.png');
        //this.load.image('pageText', './assets/img/scene/game/page-text.png');
        //this.load.image('emailField', './assets/img/scene/game/email-field.png');
    }  

    Congrats()
    {
        this.load.image('congratsBg', './assets/img/scene/result/result.png'); 
        this.load.image('resultBg', './assets/img/scene/result/result2.png'); 
    }

    HowTo()
    {
        this.load.image('howtoBg', './assets/img/scene/howto/howto-bg.png'); 
        this.load.image('closeButton', './assets/img/scene/howto/close.png'); 
    }

    Audio(){
        this.load.audio('bg', './assets/audio/bg.mp3');
        this.load.audio('click', './assets/audio/click.mp3');
        this.load.audio('congrats', './assets/audio/levelup.mp3');
        this.load.audio('popup', './assets/audio/popup.mp3');
        this.load.audio('error', './assets/audio/error.mp3');
    }
}