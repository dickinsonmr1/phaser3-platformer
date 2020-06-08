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
 

     constructor(params) {
         super(params.scene, params.x, params.y, params.key, params.frame);
 
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
        //this.anims.play(this.onTileKey, true);

        this.turnOff();
 
        return;        
     }
 
    turnOff(): void {  
        //this.
    }
      
    turnOn(sound): void {
        this.anims.play(this.onAnim, true);
    }

    update(): void {

    }
 }