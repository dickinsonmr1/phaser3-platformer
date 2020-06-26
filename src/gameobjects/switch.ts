/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="../dts/phaser.d.ts"/>
 import { Constants, ForceFieldColor } from "../constants";
 import "phaser";
 import { Scene } from "phaser";
import { MainScene } from "../scenes/mainScene";
 
 export class Switch extends Phaser.GameObjects.Sprite {
     public activated: boolean;
 
     private offAnim: string;
     private onAnim: string;

     public transitionTime: number;
     public color: ForceFieldColor;

     constructor(params) {
         super(params.scene, params.x, params.y, params.key); 
     } 
     
     public getScene(): Scene {
         return this.scene;
     }
 
     public init(color: ForceFieldColor, offAnim: string, onAnim: string): void {
         
        this.color = color;
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

        this.turnOff();
 
        return;        
     }
 
    toggle() {
        if(this.transitionTime == 0) {
            this.scene.sound.play("switchSound");
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

        var mainScene = <MainScene>this.scene;
        mainScene.world.toggleForceFields(this.color, false);
    }
      
    private turnOn(): void {
        this.anims.play(this.onAnim, true);
        this.activated = true;
        this.transitionTime = 5;

        var mainScene = <MainScene>this.scene;
        mainScene.world.toggleForceFields(this.color, true);
    }

    preUpdate(time, delta): void {
        super.preUpdate(time, delta);

        if(this.transitionTime > 0)
            this.transitionTime--;
    }
}