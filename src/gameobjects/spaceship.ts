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

     public static get spaceshipVelocity(): number { return 800; }    

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

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;
            
            body.setVelocity(0, 0);

            this.activated = false;
            this.transitionTime = 30;
        }        
    }
      
    turnOn(): void {
        if(!this.activated  && this.transitionTime == 0) {

            this.anims.play(this.mannedAnim, true);
            this.activated = true;
            this.scene.sound.play('engineSound');

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.moves = true;
            body.allowGravity = false;
        }
        
        //this.transitionTime = 5;
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        if(this.transitionTime > 0)
            this.transitionTime--;
    }
}