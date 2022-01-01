/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>

import "phaser";
import { Scene } from "phaser";
import { MainScene } from "../client/scenes/mainScene";
import { METHODS } from "http";
import { HealthBar } from "../client/scenes/healthBar";
import { Constants } from "../client/constants";
import { timeStamp } from "console";
import { Bullet } from "./bullet";

export enum EnemyType {
    Stalker,
    Patrol,
    Homing,
    Spectre,
    Boss
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
    private jumpAnim: string;
    private drawScale: number;
    private widthOverride: number;
    private heightOverride: number;

    private enemyType: EnemyType;

    private followDistance: number;

    public idleTime: number;
    public jumpTime: number;

    public patrolMoveRight: boolean;

    public homingDistance: number;
    public showHealthBar: boolean;

    public bossHealthBar: HealthBar;
    //private get healthBarOffsetX(): number {return -110;}
    private get healthBarOffsetY(): number {return -180;}

    private bossNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetY(): number { return -200; }
    private bulletTimeInterval: number = 30;
    private bulletTime: number = 0; 

    public enemyName: string;

    private bulletSpeed: number = 600;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.drawScale = params.drawScale;
        this.scene.physics.world.enable(this);
        this.drawOffsetY = params.enemyOffsetY;
        this.defaultFacingRight = params.defaultFacingRight;
        this.widthOverride = params.widthOverride;
        this.heightOverride = params.heightOverride;
        this.enemyType = params.enemyType;
        this.enemyName = params.enemyName;

        if(params.homingDistance != null) {
            this.followDistance = params.homingDistance;
        }
        else {
            this.followDistance = 500;
        }

        this.showHealthBar = this.enemyType == EnemyType.Boss;
    } 
    
    public getScene(): Scene {
        return this.scene;
    }

    //public getPosition(): 

    public init(idleAnim: string, walkAnim: string, deadAnim: string, jumpAnim: string): void {

        this.setFlipX(this.defaultFacingRight);

        this.patrolMoveRight = true;

        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.deadAnim = deadAnim;
        this.jumpAnim = jumpAnim;
        
        if(this.widthOverride != undefined)
            this.width = this.widthOverride;

        if(this.heightOverride != undefined)
            this.height = this.heightOverride;

        this.scene.physics.world.enable(this);   

        //this.displayWidth = 64;
        //this.displayHeight = 64;            

        var body = <Phaser.Physics.Arcade.Body>this.body;
        
        if(this.enemyType == EnemyType.Homing) {
            body.allowGravity = false;
        }

        if(this.widthOverride != undefined && this.heightOverride != undefined)
            body.setSize(this.width, this.height)    
        
        body.setOffset(0, this.drawOffsetY);    

        //this.body.debugBodyColor = 0xadfefe;
              
        this.displayOriginX = 0.5;
        this.displayOriginY = this.enemyType == EnemyType.Boss ? 0 : 0.5;

        this.originX = 0.5;
        this.originY = this.enemyType == EnemyType.Boss ? 1 : 0.5;

        this.setScale(this.drawScale, this.drawScale);
        
        this.scene.add.existing(this);

        this.hurtTime = 0;
        this.idleTime = 0;
        this.jumpTime = 0;

        if(this.enemyType == EnemyType.Boss)
            this.health = 3000;
        else
            this.health = 100;

        this.springTime = 0;

        this.anims.play(this.idleAnim, true);

        
        // multiplayer health bar
        this.bossHealthBar = new HealthBar(this.getScene());
        this.bossHealthBar.init(this.x - this.widthOverride / 2, this.y + this.healthBarOffsetY,
            this.health, 
            200, 15, false);
        this.bossHealthBar.setDepth(Constants.depthHealthBar);
        if(this.showHealthBar)
            this.bossHealthBar.show();
        else
            this.bossHealthBar.hide();

        // name text
        var playerNameText = this.scene.add.text(this.x, this.y //- this.GetTextOffsetY
            , this.enemyName,
            {
                fontFamily: 'KenneyRocketSquare',         
                color:"rgb(255,255,255)",
            });
        playerNameText.setAlpha(0.9);
        //playerNameText.setOrigin(0.5, 0.5);
        playerNameText.setDepth(7);
        playerNameText.setStroke('rgb(0,0,0)', 4);     
        playerNameText.setFontSize(24); 
        
        this.bossNameText = playerNameText;
        this.alignPlayerNameText(this.x, this.y + this.GetPlayerNameOffsetY);
        this.bossNameText.setOrigin(0.5, 0.5);
        this.bossNameText.setFontSize(20);
        this.bossNameText.setVisible(this.showHealthBar);

        return;        
    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.bossNameText;
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0.5, 0.5);
    }

    idle(): void {
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.setVelocityX(0);            
            this.anims.play(this.idleAnim, true);
            this.idleTime = 5;
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

    moveLeftIgnoreFloor(): void {
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            
            if(body.onFloor() || this.jumpTime == 0)
                this.anims.play(this.walkAnim, true);
            else
                this.anims.play(this.jumpAnim, true);

            body.setVelocityX(-150);
            this.flipX = !this.defaultFacingRight;
        }
    }

    moveRightIgnoreFloor(): void {        
        if(this.scene != undefined) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            
            if(body.onFloor() || this.jumpTime == 0)
                this.anims.play(this.walkAnim, true);
            else
                this.anims.play(this.jumpAnim, true);

            body.setVelocityX(150);            
            this.flipX = this.defaultFacingRight;
        }
    }

    homeTowardsPlayer(playerX: number, playerY: number): void {        
        if(this.scene != undefined) {

            var scene = <MainScene>this.scene;
            var body = <Phaser.Physics.Arcade.Body>this.body;            
            this.scene.physics.moveToObject(this, scene.player, 150);
        }
    }

    tryDamage(damage: number) {
        if(this.hurtTime == 0) {
            this.health -= damage;
            this.hurtTime = 60;

            this.bossHealthBar.updateHealth(this.health);

            if(this.health <= 0) {
                this.scene.sound.play("enemyDeathSound");
                
                var scene = <MainScene>this.scene;
                scene.player.enemiesKilled++;

                this.bossHealthBar.hide();
                this.bossHealthBar.destroy();

                this.bossNameText.destroy();
                this.destroy();       
                //this.anims.play(this.deadAnim, true);
                //var body = <Phaser.Physics.Arcade.Body>this.body;            
            }
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
                if(this.jumpAnim != null)
                    this.anims.play(this.jumpAnim, true);
                //sound.play("springSound");

                //this.springTime = gameTime + 1000;
            //}        f
        //}
    }

    tryJump() {     
        
        var body = <Phaser.Physics.Arcade.Body>this.body;
        if(body.onFloor()) {           
            body.setVelocityY(-300);
            this.anims.play(this.jumpAnim, true);
            this.jumpTime = 60;
        }
        //sound.play("springSound");
    }

    tryFireBullet(gameTime: number, playerX: number, playerY: number, sound: string): void {
        
        if(gameTime > this.bulletTime) {

            var velocityX = 0;
            var velocityY = 0;

            var body = <Phaser.Physics.Arcade.Body>this.body;
            var sourceX = body.center.x;
            var sourceY = body.center.y;

            var direction = Math.atan2(playerY-sourceY, playerX-sourceX);

            // Calculate X and y velocity of bullet to moves it from shooter to target
            
            //if (playerX >= sourceX) {
                velocityX = this.bulletSpeed*Math.cos(direction);    
            //}
            //else {
                //velocityX = -this.bulletSpeed*Math.cos(direction);
            //}
            //if (playerY >= sourceY) {
                velocityY = this.bulletSpeed*Math.sin(direction);
            //}
            //else {
                //velocityY = -this.bulletSpeed*Math.sin(direction);
            //}
            var bullet = this.createBullet(velocityX, velocityY);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
        //this.currentWeapon.currentAmmo--;
        
        //sound.play(this.currentWeaponSoundName);
        //this.scene.events.emit("weaponFired", this.currentWeapon.currentAmmo);

        /*
        var socket = this.getSocket();
        //socket.emit('playerMovement', new PlayerOnServer(50, 50, socket.id));//{ x: player.x, y: player.y });
        if(socket != null) {
            // sends back to server
            socket.emit('newBullet', bullet);
        }
        
        //if(this.ammoCount < 3) 
            //this.scene.sound.play("lowAmmoSound");            

        if(this.currentWeapon.currentAmmo == 0) {
            this.playerGun.alpha = 0.0;
            this.scene.sound.play("noAmmoSound");
        }*/            
    }

    private createBullet(velocityX: number, velocityY: number) : Bullet {

        var body = <Phaser.Physics.Arcade.Body>this.body;

        //var velocityX: number;

        //velocityY
        //if(this.flipX)
            //velocityX = -this.playerBulletVelocityX
        //else
            //velocityX = this.playerBulletVelocityX;

        var bullet = new Bullet({
            scene: this.scene,
            x: body.center.x, //+ this.playerBulletOffsetX(),
            y: body.center.y, //+ this.getBulletOffsetY(),
            key: "playerGunLaser1",//this.currentWeaponBulletName,
            flipX: this.flipX,
            damage: 1,//this.currentWeaponDamage,
            velocityX: velocityX,
            velocityY: velocityY
        });
        bullet.init();
        //this.scene.physics.moveToObject(bullet, scene.player, 150);

        let scene = <MainScene>this.scene;
        scene.enemyBullets.add(bullet);

        return bullet;

        /*
        if (this.flipX) {
            var bullet = this.bullets
                .create(body.x, body.y + this.getBulletOffsetY(), this.currentWeaponBulletName)
                .setFlipX(true)
                .body.setVelocityX(-this.playerBulletVelocityX)
                .setVelocityY(0);

            //bullet.damage = 4;
        }
        else {
            var bullet = this.bullets
                .create(body.x + Player.playerBulletOffsetX, body.y + this.getBulletOffsetY(), this.currentWeaponBulletName)
                .body.setVelocityX(this.playerBulletVelocityX)
                .setVelocityY(0);

            //bullet.damage = 4;
        }
        */
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
                var walkOffEdgeTile: any;

                switch(this.enemyType){
                    case EnemyType.Stalker:
                        if(Math.abs(playerX - body.center.x) < this.followDistance && Math.abs(playerY - body.center.y) < this.followDistance) {
                            if(playerX < this.x) {
                                var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                                
                                if(tileAtEnemyPosition != null && tileAtEnemyPosition.x > 0)
                                    walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x - 1, tileAtEnemyPosition.y + 1, false);
                    
                                if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                    this.moveLeft();
                                else
                                {
                                    this.idle();
                                }
                            }
                            else if (playerX > this.x) {
                                var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                                if(tileAtEnemyPosition != null)
                                    walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x + 1, tileAtEnemyPosition.y + 1, false);
                    
                                if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                    this.moveRight();
                                else
                                {
                                    this.idle();
                                }
                            }
                        }
                        else {
                            this.idle();
                        }              
                        break;
                    case EnemyType.Boss:   

                        var randJump = Math.random() < 0.02;
                        if(randJump)
                            this.tryJump();

                        var randFireBullet = Math.random() < 0.05;
                        if(randFireBullet)
                            this.tryFireBullet(scene.sys.game.loop.time, playerX, playerY, "");
                            
                        
                        if(playerX < this.x) {
                            var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.x - body.width, body.y + body.height * 0.8, true, null);
                            
                            if(tileAtEnemyPosition != null && tileAtEnemyPosition.x > 0)
                                walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x - 1, tileAtEnemyPosition.y + 1, false);
                
                            //if(body.onFloor() && walkOffEdgeTile != null)
                                this.moveLeftIgnoreFloor();
                            //else {
                                //this.idle();
                            //}
                        }
                        else if (playerX > this.x) {
                            var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.x + body.width, body.y + body.height * 0.8, true, null);
                            if(tileAtEnemyPosition != null)
                                walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x + 1, tileAtEnemyPosition.y + 1, false);
                
                            //if(body.onFloor() && walkOffEdgeTile != null)
                                this.moveRightIgnoreFloor();
                            //else {
                                //this.idle();
                            //}
                        }      
                        break;
                    case EnemyType.Homing:
                        if(Math.abs(playerX - body.center.x) < this.followDistance && Math.abs(playerY - body.center.y) < this.followDistance) {
                            this.homeTowardsPlayer(playerX, playerY);
                        }
                        else {
                            this.idle();
                        }              
                        break;
                    case EnemyType.Patrol:
                        if(!this.patrolMoveRight) {
                            var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                            if(tileAtEnemyPosition != null && tileAtEnemyPosition.x > 0)
                                walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x - 1, tileAtEnemyPosition.y + 1, false);

                            if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                this.moveLeft();
                            else
                            {
                                this.patrolMoveRight = true;
                            }
                        }
                        else if (this.patrolMoveRight) {
                            var tileAtEnemyPosition = scene.world.getLayer02().getTileAtWorldXY(body.center.x, body.center.y, true, null);
                            if(tileAtEnemyPosition != null)
                                walkOffEdgeTile = scene.world.getLayer02().getTileAt(tileAtEnemyPosition.x + 1, tileAtEnemyPosition.y + 1, false);
                
                            if(!body.onWall() && body.onFloor() && walkOffEdgeTile != null)
                                this.moveRight();
                            else
                            {
                                this.patrolMoveRight = false;
                            }
                        }                    
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

            if(this.jumpTime > 0) {
                this.jumpTime--;
            }  
            
            if(this.bulletTime > 0)
                this.bulletTime--;

            if(this.health >= 0) {
                var offsetX = Math.abs(this.bossHealthBar.healthMaxWidthInPixels - this.widthOverride / 2);
                this.bossHealthBar.updatePosition(this.x - offsetX, this.y + this.healthBarOffsetY);
                this.alignPlayerNameText(this.x, this.y + this.GetPlayerNameOffsetY);
            }
        }
    }
}