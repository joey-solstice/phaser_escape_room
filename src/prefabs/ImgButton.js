export class ImgButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, image, callback) {
        super(scene, x, y, image);

        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {

               // this.enterButtonHoverState();
                callback();
            });
    }

    enterButtonHoverState() { 
        this.setScale(this.scale  );
    }

    enterButtonRestState() {
        this.setScale(this.scale  );
    }

    enterButtonActiveState() {
        // console.log('clicked');
      //  this.setScale(this.scale - 0.02);
    }
}
