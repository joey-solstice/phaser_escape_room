export class AudioManager {
    
    constructor(scene) {
        this.scene = scene;
    } 
    
    add(){
        this.scene.bgAudio = this.scene.sound.add('bg'); 
        this.scene.clickAudio = this.scene.sound.add('click'); 
        this.scene.popupAudio = this.scene.sound.add('popup'); 
        this.scene.congratsAudio = this.scene.sound.add('congrats'); 
        this.scene.errorAudio = this.scene.sound.add('error'); 
    } 

    play(key)
    {
        this.scene.sound.play(key);
    }

}
 