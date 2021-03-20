/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

  /// <reference path="../../dts/phaser.d.ts"/>
  import "phaser";
 import { Scene } from "phaser";
import { Constants } from "../constants";
 
 export class ExpiringText extends Phaser.GameObjects.Text {
     public decayTimeInMs: number;

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

        this.scene.add.existing(this); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(decayTimeInMs: number): void {

        // not used yet
        this.decayTimeInMs = decayTimeInMs;

       

        this.setAlpha(1.0);
        
        return;        
     }
 }