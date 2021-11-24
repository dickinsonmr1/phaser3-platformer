/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>

import { Constants } from "../client/constants";
import "phaser";
import { Scene } from "phaser";
import { MainScene } from "../client/scenes/mainScene";
import { METHODS } from "http";

export enum EnemyType {
    Stalker,
    Patrol,
    Homing,
    Spectre
}

export class Enemy extends Phaser.GameObjects.Sprite {
    public hurtTime: number;
    public springTime: number;
    public health: number;
    
    private drawOffsetY: number;
    private defaultFacingRight: boolean;
    private idleAnim: string;
    private walkAnim: string;
    private deadAnim: string;
    private drawScale: number;
    private widthOverride: number;
    private heightOverride: number;

    private enemyType: EnemyType;

    private followDistance: number;

    public idleTime: number;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.drawScale = params.drawScale;
        this.scene.physics.world.enable(this);
        this.drawOffsetY = params.enemyOffsetY;
        this.defaultFacingRight = params.defaultFacingRight;
        this.widthOverride = params.widthOverride;
        this.heightOverride = params.heightOverride;
        this.enemyType = params.enemyType;
    } 
    
    public getScene(): Scene {
        return this.scene;
    }

    //public getPosition(): 

    public init(idleAnim: string, walkAnim: string, deadAnim: string): void {

        this.setFlipX(this.defaultFacingRight);

        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.deadAnim = deadAnim;
        
        if(this.widthOverride != undefined)
            this.width = this.widthOverride;

        if(this.heightOverride != undefined)
            this.height = this.heightOverride;

        this.scene.physics.world.enable(this);   

        //this.displayWidth = 64;
        //this.displayHeight = 64;            

        var body = <Phaser.Physics.Arcade.Body>this.body;

        if(this.widthOverride != undefined && this.heightOverride != undefined)
            body.setSize(this.width, this.height)    
        
        body.setOffset(0, this.drawOffsetY);    

        //this.body.debugBodyColor = 0xadfefe;
              
        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.originX = 0.5;
        this.originY = 0.5;

        this.setScale(this.drawScale, this.drawScale);
        
        this.scene.add.existing(this);

        this.hurtTime = 0;
        this.idleTime = 0;
        this.health = 100;
        this.springTime = 0;
        this.followDistance = 500;

        this.anims.play(this.idleAnim, true);

        return;        
    }

    idle(): void {
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.setVelocityX(0);            
            this.anims.play(this.idleAnim, true);
            this.idleTime = 60;
        }
    }
    
    moveLeft(): void {
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            var scene = <MainScene>this.scene;
            if(body.onFloor()) {
                var body = <Phaser.Physics.Arcade.Body>this.body;
                body.setVelocityX(-150);            
                this.anims.play(this.walkAnim, true);
                this.flipX = !this.defaultFacingRight;
            }
            else {
                this.idle();
            }
        }
    }

    moveRight(): void {        
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;            
            if(body.onFloor()) {
                var body = <Phaser.Physics.Arcade.Body>this.body;
                body.setVelocityX(150);            
                this.anims.play(this.walkAnim, true);
                this.flipX = this.defaultFacingRight;
            }
            else {
                this.idle();
            }
        }
    }

    tryDamage(damage: number) {
        this.health -= damage;
        this.hurtTime = 60;

        if(this.health <= 0) {
            this.scene.sound.play("enemyDeathSound");
            
            var scene = <MainScene>this.scene;
            scene.player.enemiesKilled++;

            this.destroy();       
            //this.anims.play(this.deadAnim, true);
            //var body = <Phaser.Physics.Arcade.Body>this.body;            
        }
    }

    tryBounce() {        
        //var gameTime = this.scene.game.loop.time;
        //if (gameTime > this.springTime) { //} && !this.body.onFloor()) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            //if(body.onFloor()) {
                //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
                    //if (!player.isTouchingSpring) {
                        //if(springSound.)
                        //if (tile.alpha > 0) {
                body.setVelocityY(-650);
                //sound.play("springSound");

                //this.springTime = gameTime + 1000;
            //}        
        //}
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
                var scene = <MainScene>this.scene;
                var body = <Phaser.Physics.Arcade.Body>this.body;
                switch(this.enemyType){
                    case EnemyType.Stalker:

                        var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                        var walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x - 1, tileAtEnemyPosition.y + 1, false);
            
                        if(Math.abs(playerX - body.x) < this.followDistance && Math.abs(playerY - body.y) < this.followDistance)
                        if(playerX < this.x) {
                            if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                this.moveLeft();
                            else
                            {
                                this.idle();
                            }
                        }
                        else if (playerX > this.x) {

                            var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                            var walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x + 1, tileAtEnemyPosition.y + 1, false);
                
                            if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                this.moveRight();
                            else
                            {
                                this.idle();
                            }
                        }
                        else {
                            this.idle();
                        }              
                        break;

                    case EnemyType.Homing:
                        
                        //if(!body.onWall() && body.checkCollision.)
                        break;
                    case EnemyType.Patrol:
                        break;
                    case EnemyType.Spectre:
                        break;
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
}