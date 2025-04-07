export class AnimationManager {
    constructor(scene) {
        this.scene = scene;
    }

    animateToCenter(wheel, wheelBg, wheelPointer, x, y, onCompleteCallback)
    {
        this.scene.tweens.add({
            targets: [wheel, wheelBg, wheelPointer],
            x: x, // Move to center (horizontally)
            y:  (target) => target === wheelPointer ? y - 20 : y, // Move to center (vertically)
            duration: 500, // Animation duration (1 second)
            ease: function (t) { 
                return Phaser.Math.Easing.Cubic.Out(Phaser.Math.Easing.Quadratic.In(t));
            },
            onComplete: onCompleteCallback  
        });
    }

    spinWheelAnimation(wheel, data, onCompleteCallback ){ 
        const arrow_pointing = 0; // 0 UP, 1 DOWN
        const arrow_pointing_angle = arrow_pointing == 0 ? 0 : 180;  
        const angle = 360 * 10 + data.data.prize_angle + arrow_pointing_angle; parseInt(); 
        this.scene.tweens.add({
            targets: wheel,
            angle: angle,
            duration: 8000, //10000
            ease: Phaser.Math.Easing.Cubic.Out, // Fast start, slow finish
            onComplete: onCompleteCallback   
        });
    }

    animateButton(image)
    {   
        const duration = 1000;  
        this.scene.tweens.add({
          targets: image,
          scale: image.scale + 0.1, 
          duration: duration,
          ease: Phaser.Math.Easing.Sine.InOut,
          yoyo: true, // Reverse the tween after completion
          repeat: -1 // Repeat indefinitely
      });
    }

    wiggleField(imageToWiggle){  
        
        this.scene.spinBtn.disableInteractive();
        var wiggleDuration = 200;  // Duration of each half-wiggle in milliseconds
        var wiggleDistance = 20;   // Distance to move during each half-wiggle

        var numRepetitions = 2;
         
         // Create the wiggle tweens
        this.wiggleTween = this.scene.tweens.add({
            targets: imageToWiggle,
            x: imageToWiggle.x - wiggleDistance,
            ease: 'Linear',
            duration: wiggleDuration / (2 * numRepetitions),
            yoyo: true,
            repeat: numRepetitions,  // Repeat the wiggle for the specified number of times,
            onComplete: () => {
                this.scene.spinBtn.setInteractive();
            }
        });
        
    }
}
 