 import { PreLoadScene } from "./scenes/PreLoadScene.js"
import { HomeScene } from "./scenes/HomeScene.js"
import { BackStoryScene } from "./scenes/BackStory.js"
import { GameScene } from "./scenes/GameScene.js"
import { InformationScene } from "./scenes/InformationScene.js"
import { LoadScene } from "./scenes/LoadScene.js"
import { HowToScene } from "./scenes/HowToScene.js" 
import { CongratsScene } from "./scenes/CongratsScene.js" 
import { ErrorScene } from "./scenes/ErrorScene.js" 



import { R1C1 } from "./scenes/challenges/R1C1.js"
import { R1C2 } from "./scenes/challenges/R1C2.js"
import { R1C3 } from "./scenes/challenges/R1C3.js"
import { R1C4 } from "./scenes/challenges/R1C4.js"

import { R2C1 } from "./scenes/challenges/R2C1.js"
import { R2C2 } from "./scenes/challenges/R2C2.js"
import { R2C3 } from "./scenes/challenges/R2C3.js"
import { R2C4 } from "./scenes/challenges/R2C4.js"

import { RoomInfo } from "./scenes/RoomInfo.js"



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
        RoomInfo,
        R1C1,
        R1C2,
        R1C3,
        R1C4,
        R2C1,
        R2C2,
        R2C3,
        R2C4,
        InformationScene,
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
 
