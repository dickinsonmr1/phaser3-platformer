/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Portal extends Phaser.GameObjects.Sprite {
     public activated: boolean;
     public activationTime: number;

     public destinationName: string;
 
     private idleAnim: string;
     private waveAnim: string;

     buttonX: Phaser.GameObjects.Image;

     private get GetTextOffsetY(): number { return 110; }
     private get GetIconOffsetY(): number { return 150; }
 
     public idleTime: number;
 
     constructor(params) {
         super(params.scene, params.x, params.y, params.key, params.frame);
 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(idleAnim: string, waveAnim: string, destinationName: string): void {
         
        this.idleAnim = idleAnim;
        this.waveAnim = waveAnim;
        this.destinationName = destinationName;
     
        this.width = 128;
        this.height = 128;
 
        this.scene.physics.world.enable(this, 0);   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setSize(128, 128);     
        body.moves = false;
        
        this.setScale(0.5, 0.5);

        this.scene.add.existing(this);
            
        //this.activated = false;
        //this.anims.play(this.idleAnim, true);
 
        var text = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "Synchronosis",
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 24,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        text.setAlpha(0.9);
        text.setOrigin(0.5, 0);
        text.setStroke('rgb(0,0,0)', 4);

        this.buttonX = this.scene.add.image(this.x, this.y - this.GetIconOffsetY, 'buttonX');
        text.setOrigin(0.5, 0);

        this.hideButtonIcon(); 

        return;        
     }
 
    /*
    idle(): void {  
        if(this.scene != undefined) {       
            this.anims.play(this.idleAnim, true);
        }
    }
      
    activate(sound): void {
        if(!this.activated) {
            this.activated = true;
            this.activationTime = 60;
            if(this.scene != undefined) {
                this.anims.play(this.waveAnim, true);
            }
        }        
    }
    */

    displayButtonIcon(): void {
        this.activationTime = 60;
        this.buttonX.setAlpha(0.8);
    }

    hideButtonIcon(): void {
        this.activationTime = 0;
        this.buttonX.setAlpha(0.0);
    }

    update(): void {
        if(this.activationTime > 0)
            this.activationTime--;
        else {
            if(this.activated) {
                this.hideButtonIcon();
            }
        }
    }
 }