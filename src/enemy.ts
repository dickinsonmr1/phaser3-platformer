/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 
 /// <reference path="phaser.d.ts"/>
import { Constants } from "./constants";
import "phaser";
import { Scene } from "phaser";

export class Enemy extends Phaser.GameObjects.Sprite {
    public hurtTime: number;
    public health: number;

    private idleAnim: string;
    private walkAnim: string;
    private deadAnim: string;

    public idleTime: number;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.scene.physics.world.enable(this);
    } 
    
    public getScene(): Scene {
        return this.scene;
    }

    public init(idleAnim: string, walkAnim: string, deadAnim: string): void {
        
        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.deadAnim = deadAnim;

        //this. public static get enemyOffsetY(): number {return 10;}
        this.setScale(1.5, 1.5);

        this.body
            //.setSize(64, 128)
            .setOffset(0, Constants.enemyOffsetY);    

        this.setFlipX(true);
        /*


        // physics
        this.width = 128;
        this.height = 256;
        
        this.currentScene.physics.world.enable(this);

        this.displayWidth = 64;
        this.displayHeight = 128;                   

        /*
        this.body.maxVelocity.x = 500;
        this.body.maxVelocity.y = 500;
        this.body
            .setSize(64, 128)
            .setOffset(Constants.playerOffsetX, Constants.playerOffsetY);    

        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        

        this.currentScene.add.existing(this);
        */
    
        this.hurtTime = 0;
        this.idleTime = 0;
        this.health = 8;
        //this.anims = anims;
        //this.createAnims(anims);

        return;        
    }

    private createAnims(anims) {
        
        /*
        anims.create({
            key: 'walk',
            frames: anims.generateFrameNames('playerSenemySpritesprites', { prefix: 'alienBlue_walk', start: 1, end: 2, zeroPad: 1, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });
        */

      
      
    }

    idle(): void {
        if(this.scene != undefined) {
            this.body.setVelocityX(0);            
            this.anims.play(this.idleAnim, true);
        }
    }

    
    moveLeft(): void {
        if(this.scene != undefined) {
            if(this.body.onFloor()) {
                this.body.setVelocityX(-150);            
                this.anims.play(this.walkAnim, true);
                this.flipX = true;
            }
        }
    }

    moveRight(): void {        
        if(this.scene != undefined) {
            if(this.body.onFloor()) {
                this.body.setVelocityX(150);            
                this.anims.play(this.walkAnim, true);
                this.flipX = false;
            }
        }
    }

    /*
    tryJump(sound): void {
        if(this.body.onFloor()) {
            this.body.setVelocityY(-400);
            this.anims.play('jump', true);
            sound.play("jumpSound");
        }
    }

    tryDamage(): void {

        if(this.hurtTime == 0) {
            if(this.health > 0) {
                this.health--;
                this.currentScene.events.emit("playerHealthUpdated", this.health);
                this.currentScene.sound.play("hurtSound");
                this.hurtTime = 60;
            }
        }
    }
    */
    
  
    update(playerX: number, playerY: number): void {
        if(this.scene != undefined) {
            if(this.idleTime == 0)
            {
                var body = <Phaser.Physics.Arcade.Body>this.body;
                if(playerX < this.x) {
                    if(!body.onWall())
                        this.moveLeft();
                    else
                    {
                        this.idle();
                    }
                }
                else if (playerX > this.x) {
                    if(!body.onWall())
                        this.moveRight();
                    else
                    {
                        this.idle();
                    }
                }
                else {
                    this.idle();
                }      
            }
        }

        if(this.hurtTime > 0) {
            this.hurtTime--;
            if(this.hurtTime > 30)
                this.setAlpha(0.5);
            else
                this.setAlpha(1);
        }    

        if(this.idleTime > 0) {
            this.idleTime--;
        }    
    }
}