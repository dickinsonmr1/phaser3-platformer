/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Switch extends Phaser.GameObjects.Sprite {
     public activated: boolean;
 
     private offAnim: string;
     private onAnim: string;

     public transitionTime: number;

     constructor(params) {
         super(params.scene, params.x, params.y, params.key); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(offAnim: string, onAnim: string): void {
         
        this.offAnim = offAnim;
        this.onAnim = onAnim;

        this.width = 64;
        this.height = 64;
 
        this.scene.physics.world.enable(this, 0);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setSize(64, 64);     
        body.moves = false;
        
        this.setScale(1, 1);

        this.scene.add.existing(this);
            
        this.activated = false;
        this.transitionTime = 0;
        //this.anims.play(this.onTileKey, true);

        this.turnOff();
 
        return;        
     }
 
    toggle() {
        if(this.transitionTime == 0) {
            if(this.activated) {
                this.turnOff();
                return;
            }
            else {
                this.turnOn();
            }
        }
    }

    private turnOff(): void {  
        this.anims.play(this.offAnim, true);
        this.activated = false;
        this.transitionTime = 5;
    }
      
    private turnOn(): void {
        this.anims.play(this.onAnim, true);
        this.activated = true;
        this.transitionTime = 5;
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        if(this.transitionTime > 0)
            this.transitionTime--;
    }
}