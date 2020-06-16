/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../dts/phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Checkpoint extends Phaser.GameObjects.Sprite {
     public activated: boolean;
 
     private idleAnim: string;
     private waveAnim: string;
 
     public idleTime: number;
 
     constructor(params) {
         super(params.scene, params.x, params.y, params.key, params.frame);
 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(idleAnim: string, waveAnim: string): void {
         
        this.idleAnim = idleAnim;
        this.waveAnim = waveAnim;
     
        this.width = 128;
        this.height = 128;
 
        this.scene.physics.world.enable(this, 0);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setSize(128, 128);     
        body.moves = false;
        
        this.setScale(0.5, 0.5);

        this.scene.add.existing(this);
            
        this.activated = false;
        this.anims.play(this.idleAnim, true);
 
        return;        
     }
 
    idle(): void {  
        if(this.scene != undefined) {       
            this.anims.play(this.idleAnim, true);
        }
    }
      
    activate(sound): void {
        if(!this.activated) {
            this.activated = true;
            if(this.scene != undefined) {
                this.anims.play(this.waveAnim, true);
            }
        }        
    }

    update(): void {

    }
 }