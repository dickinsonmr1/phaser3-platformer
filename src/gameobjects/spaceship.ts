/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Spaceship extends Phaser.GameObjects.Sprite {
     public activated: boolean;
 
     private unmannedAnim: string;
     private mannedAnim: string;

     public transitionTime: number;

     private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
     private get emitterOffsetY(): number {return 30;}

     public static get spaceshipVelocity(): number { return 600; }    

     constructor(params) {
         super(params.scene, params.x, params.y, params.key); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(unmannedAnim: string, mannedAnim: string): void {
         
        this.unmannedAnim = unmannedAnim;
        this.mannedAnim = mannedAnim;

        this.width = 124;
        this.height = 90;

        //this.displayWidth = 93;
        //this.displayHeight = 68;

 
        this.scene.physics.world.enable(this, 0);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        //body.setSize(93, 68);     
        body.setSize(124, 90);     
        body.moves = false;
        body.allowGravity = true;
        
        this.setScale(0.75, 0.75);

        this.scene.add.existing(this);
            
        this.activated = false;
        this.transitionTime = 0;
        this.anims.play(this.unmannedAnim, true);

        var particles = this.scene.add.particles('engineExhaust');
        particles.setDepth(4);

        this.particleEmitter = particles.createEmitter({
            x: this.x,
            y: this.y,
            lifespan: 500,
            speed: { min: 400, max: 400 },
            angle: 90,
            gravityY: 300,
            scaleX: { start: 1, end: 2 },
            scaleY: 0.5,
            quantity: 1,
            blendMode: 'ADD',
            frequency: 100,
            alpha: {start: 0.8, end: 0.0}
            //active: false
        });
        this.particleEmitter.stop();
        //this.turnOff();
 
        return;        
     }

    /*
    toggle() {
        if(this.transitionTime == 0) {
            this.scene.sound.play("switchSound");
            if(this.activated) {
                this.turnOff();
                return;
            }
            else {
                this.turnOn();
            }
        }
    }
    */

    turnOff(): void {  

        if(this.activated) {
            this.anims.play(this.unmannedAnim, true);

            this.particleEmitter.stop();
            this.scene.sound.stopByKey('engineSound')

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;
            
            body.setVelocity(0, 0);

            this.activated = false;
            this.transitionTime = 60;
        }        
    }
      
    turnOn(): void {
        if(!this.activated  && this.transitionTime == 0) {
            
            this.anims.play(this.mannedAnim, true);
            this.activated = true;
            this.scene.sound.play('engineSound', { volume: 0.5, loop: true });

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;

            this.particleEmitter.start();
            this.particleEmitter.setPosition(this.x, this.y + this.emitterOffsetY);
        }
        
        //this.transitionTime = 5;
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        this.particleEmitter.setPosition(this.x, this.y + this.emitterOffsetY);

        if(this.transitionTime > 0)
            this.transitionTime--;
    }
}