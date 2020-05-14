/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="phaser.d.ts"/>
 import { Constants } from "./constants";
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

        //this. public static get enemyOffsetY(): number {return 10;}
        
                
        this.width = 64;
        this.height = 64;

        this.scene.physics.world.enable(this);   

        this.displayWidth = 64;
        this.displayHeight = 64;     

        this.body.moves = false;
        this.body.immovable = true;
        
        this.displayWidth = 64;
        this.displayHeight = 64;            

        this.body.setOffset(0, 1);    
              
        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.setScale(0.5, 0.5);
        
        this.scene.add.existing(this);

        //this.body.setSize(64, 32);            
    
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
                sound.play("springSound");
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