/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>
import { BodyFactory } from "matter";
import "phaser";

import { Scene } from "phaser";
import { Constants } from "../client/constants";
 
 export class ExpiringText extends Phaser.GameObjects.Text {
     public decayTimeInMs: number;
     public isAlive: boolean;

     private get GetTextOffsetY(): number { return 110; }
 
     constructor(params) {
        super(params.scene, params.x, params.y, params.text, {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color:"rgb(255,255,255)"
        });

        //this.x = this.x - this.width / 4;
        //this.setOrigin(0.5, 0.5);
        this.setFontSize(24);        

        this.setDepth(Constants.depthExpiringMessages);        
        this.setStroke('rgb(0,0,0)', 4);       
      
        this.setAlpha(0);   

        this.scene.add.existing(this); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(x: number, y: number, text: string, decayTimeInMs: number): void {
        
        
        this.text = text;
        this.decayTimeInMs = decayTimeInMs;    // not used yet
        this.x = x;
        this.y = y;
        
        this.setAlpha(1.0);
        
        return;        
     }

     public update(): void {

        if(this.alpha >= 0) {
            this.y -= 5;
            this.alpha -= 0.02;
        }
        //if(this.alpha <= 0)
            //this.destroy();
     }
 }