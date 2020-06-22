/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../dts/phaser.d.ts"/>
 import { Constants } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
 
 export class Portal extends Phaser.GameObjects.Sprite {
     public activated: boolean;
     public activationTime: number;

     public destinationName: string;
 
     private portalText: Phaser.GameObjects.Text;

     buttonX: Phaser.GameObjects.Image;

     private get GetTextOffsetY(): number { return 175; }
     private get GetIconOffsetY(): number { return 150; }
 
     public idleTime: number;

     public tileX: number;
     public tileY: number;
 
     constructor(params) {
         super(params.scene, params.x, params.y, params.key, params.frame);
 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(destinationName: string, tileX: number, tileY: number): void {
         
        this.destinationName = destinationName;
        this.tileX = tileX;
        this.tileY = tileY;
     
        this.width = 64;
        this.height = 64;
 
        this.scene.physics.world.enable(this, 0);   
        this.setAlpha(0.8);

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.setSize(64, 64);     
        
        //this.displayOriginX = 0.5;
        //this.displayOriginY = 0.5;

        body.moves = false;
        
        this.setOrigin(0.5, 0.5);
        this.setScale(2.0, 2.0);

        this.scene.add.existing(this);
             
        var text = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.destinationName,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 36,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        text.setAlpha(0.9);
        text.setOrigin(0.5, 0);
        text.setDepth(7);
        text.setStroke('rgb(0,0,0)', 4);        

        this.portalText = text;
        //this.buttonX = this.scene.add.image(this.x, this.y - this.GetIconOffsetY, 'buttonX');

        this.activated = false;
        this.activationTime = 0;

        return;        
     }
   
    activate(): void {

        if(this.activationTime == 0)
            this.getScene().sound.play("portalOpenSound", { volume: 0.5 });

        this.activationTime = 10;
        //this.buttonX.setAlpha(1.0);
        //this.portalText.setAlpha(1.0);
        
        if(this.scale < 2.0)
            this.scale += 0.1;


        //if(this.buttonX.alpha < 1)
            //this.buttonX.alpha += 0.1;
    
        if(this.portalText.alpha < 1)
            this.portalText.alpha += 0.1;      
    }

    deactivate(): void {
        this.activationTime = 0;
        //this.buttonX.setAlpha(0.0);
        //this.portalText.setAlpha(0.0);

        this.getScene().sound.play("portalCloseSound", { volume: 0.5 });
    }

    interact() {

    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        if(this.activationTime > 0) {
               
            this.rotation += 0.05;

            this.activationTime--;
            
            if(this.activationTime == 0)
                this.deactivate();
        }     
        else {
            this.rotation += 0.02;
            
            if(this.scale > 1.0)
                this.scale -= 0.1;

            //if(this.buttonX.alpha > 0)
                //this.buttonX.alpha -= 0.1;
            
            if(this.portalText.alpha > 0)
                this.portalText.alpha -= 0.1;                
        }   
    }
 }