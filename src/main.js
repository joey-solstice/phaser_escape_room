/*
import { PreLoadScene } from "./scenes/PreLoadScene.js"
import { LoadScene } from "./scenes/LoadScene.js"
import { GameScene } from "./scenes/GameScene.js" 
import { GameCompleteScene } from "./scenes/GameCompleteScene.js"
import { GameFailScene } from "./scenes/GameFailScene.js"
import { HomeScene } from "./scenes/HomeScene.js"
import { HowToScene } from "./scenes/HowToScene.js"
import { MenuScene } from "./scenes/MenuScene.js"
import { GameUI } from "./scenes/GameUI.js"
import { GameLoadingScene } from "./scenes/GameLoading.js"
import { LevelTimerScene } from "./scenes/LevelTimer.js"
import { CongratsScene } from "./scenes/Congrats.js" 
import { Prize } from "./scenes/Prize.js"
import { Thankyou } from "./scenes/Thankyou.js"
import { Leaderboard } from "./scenes/Leaderboard.js"
import { Backstory } from "./scenes/Backstory.js"
import { Share } from "./scenes/Share.js"
import { Comingsoon } from "./scenes/Comingsoon.js"
*/
import { PreLoadScene } from "./scenes/PreLoadScene.js"
import { HomeScene } from "./scenes/HomeScene.js"
import { BackStoryScene } from "./scenes/BackStory.js"
import { GameScene } from "./scenes/GameScene.js"
import { RoomGameScene } from "./scenes/RoomGameScene.js"
import { LoadScene } from "./scenes/LoadScene.js"
import { HowToScene } from "./scenes/HowToScene.js" 
import { CongratsScene } from "./scenes/CongratsScene.js" 
import { ErrorScene } from "./scenes/ErrorScene.js" 

//import * as Matter from "./matter-js.js"  

function isDesktop() {
    return !navigator.userAgent.match(/Mobi/);
}

var config = {
    type: Phaser.CANVAS,
    backgroundColor: '0xff0000',
    backgroundColor: '#000000',
    width:  1080,
    height:  1920,
    resolution: window.devicePixelRatio, 
    physics: {
        default: 'arcade',
        arcade: { 
          debug: false, // Set to true to see collision boxes
        },
    },
    scene: [  
        PreLoadScene,
        LoadScene,   
        HomeScene,
        BackStoryScene,
        GameScene,  
        RoomGameScene,
        HowToScene,
        CongratsScene,
        ErrorScene,
    ],  
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH, // Use the SHOW_ALL scale mode
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        
    },
    render: { 
        antialias: true,
        pixelArt: false,     
    },
    
    dom: {
        createContainer: true
    },
    autoRound: false,
    "transparent": true
}  
new Phaser.Game(config)
 
