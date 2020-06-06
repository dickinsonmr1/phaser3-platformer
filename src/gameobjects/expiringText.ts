/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

  /// <reference path="../phaser.d.ts"/>
  import "phaser";
 import { Scene } from "phaser";
 
 export class ExpiringText extends Phaser.GameObjects.Text {
     public decayTimeInMs: number;

     private get GetTextOffsetY(): number { return 110; }
 
     constructor(params) {
         super(params.scene, params.x, params.y, params.text, {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        
        this.scene.add.existing(this); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(decayTimeInMs: number): void {

        // not used yet
        this.decayTimeInMs = decayTimeInMs;

        this.setFontSize(24);
        this.setAlpha(1.0);
        this.setDepth(7);
        
        this.setStroke('rgb(0,0,0)', 4);        
        
        return;        
     }
 }