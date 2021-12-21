/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>

 import { Constants } from "../client/constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Spring extends Phaser.GameObjects.Sprite {
     public bounceTime: number;
 
     private loadedAnim: string;
     private sprungAnim: string;
 
     public idleTime: number;
 
     constructor(params) {
         super(params.scene, params.x, params.y, params.key, params.frame);
 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(loadedAnim: string, sprungAnim: string): void {
         
        this.loadedAnim = loadedAnim;
        this.sprungAnim = sprungAnim;
     
        this.width = 128;
        this.height = 128;
 
        this.scene.physics.world.enable(this);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setSize(128, 128);     
        body.moves = false;
        
        this.setScale(0.5, 0.5);

        this.scene.add.existing(this);
            
        this.bounceTime = 0;
        this.anims.play(this.loadedAnim, true);
 
        return;        
     }
 
    idle(): void {  
        if(this.scene != undefined) {       
            this.anims.play(this.loadedAnim, true);
        }
    }
      
    tryBounce(sound): void {
        if(this.bounceTime == 0) {
            if(this.scene != undefined) {
                this.anims.play(this.sprungAnim, true);
                //sound.play("springSound");
            }
            this.bounceTime = 30;
        }        
    }

    update(): void {

        //if(this.scene != undefined) {
            if(this.bounceTime > 0) {
                this.bounceTime--;
                this.anims.play(this.sprungAnim, true);
            }    
            else {
                this.anims.play(this.loadedAnim, true);
            }
        //}
    }
 }