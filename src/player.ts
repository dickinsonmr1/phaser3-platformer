/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="phaser.d.ts"/>
import { Constants } from "./constants";
import "phaser";
import { Scene } from "phaser";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    //public sprite: Phaser.Physics.Arcade.Sprite;
    public playerGun: any;//Phaser.Physics.Arcade.Image;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    //private anims: Phaser.Animations.AnimationManager;

    private moveKeyLeft: Phaser.Input.Keyboard.Key;
    private moveKeyRight: Phaser.Input.Keyboard.Key;
    private shootingKey: Phaser.Input.Keyboard.Key;
    private jumpingKey: Phaser.Input.Keyboard.Key;

    // game objects
    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    public bulletTime: number;
    
    private playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];

    public hasBlueKey: boolean;
    public isInWater: boolean;
    public isDucking: boolean;
    public hurtTime: number;
    public health: number;
    public gemsCollected: number;

    public isTouchingSpring: boolean;
    public springTime: number;

    public getScene(): Scene {
        return this.scene;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
    } 

    public init(): void {
        this.setFlipX(false);

        // physics
        this.width = 128;
        this.height = 256;
        
        this.scene.physics.world.enable(this);

        this.displayWidth = 64;
        this.displayHeight = 128;                   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.maxVelocity.x = 500;
        body.maxVelocity.y = 500;
        body
            .setSize(64, 128)
            .setOffset(Constants.playerOffsetX, Constants.playerOffsetY);    

        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.setScale(0.75, 0.75);

        this.scene.add.existing(this);
    
        this.hasBlueKey = false;
        this.isInWater = false;

        this.hurtTime = 0;
        this.health = 8;
        this.gemsCollected = 0;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;
        this.isDucking = false;

        this.playerGun = this.scene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, 'playerGun')        
        //this.bullets = this.currentScene.add.group();
        
        //this.createAnims(anims);

        return;        
    }

    private initImage(input: Phaser.Input.InputPlugin) {       
        // input
        this.cursors = input.keyboard.createCursorKeys();
        this.moveKeyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.moveKeyRight = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shootingKey = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.jumpingKey = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    processinput(): void {

    }

    moveLeft(): void {

        var body = <Phaser.Physics.Arcade.Body>this.body;
        body.setVelocityX(-300); // move left
            
            if(this.isInWater) {
                this.anims.play('player-swim', true);
            }
            else {
                if(body.onFloor()) {         
                    this.anims.play('player-walk', true);
                }
                else {
                    this.anims.play('player-jump', true);
                }
            }
            
            this.flipX = true; // flip the sprite to the left 
    }

    moveRight(): void {
        var body = <Phaser.Physics.Arcade.Body>this.body;
        body.setVelocityX(300); // move right

        if(this.isInWater) {
            this.anims.play('player-swim', true);
        }
        else {
            if(body.onFloor()) {
                this.anims.play('player-walk', true);
            }
            else {
                this.anims.play('player-jump', true);
            }
        }

        this.flipX = false; // use the original sprite looking to the right
    }

    duck(): void {
        var body = <Phaser.Physics.Arcade.Body>this.body;
        if(body.onFloor())
        {
            this.anims.play('player-duck', true);
            this.isDucking = true;
        }
    }

    stand(): void {
        this.isDucking = false;
        var body = <Phaser.Physics.Arcade.Body>this.body;
        body.setVelocityX(0);
        if(body.onFloor())
        {            
            this.anims.play('player-idle', true);
        }
        else
        {
            this.anims.play('player-jump', true);
        }
    }

    tryJump(sound): void {
        var body = <Phaser.Physics.Arcade.Body>this.body;
        if(body.onFloor()) {
            body.setVelocityY(-400);
            this.anims.play('player-jump', true);
            sound.play("jumpSound");
        }
    }

    tryFireBullet(gameTime: number, sound): void {
        if (gameTime > this.bulletTime) {

            this.createBullet();
            this.bulletTime = gameTime + 250;
            sound.play("laserSound");
        }
    }

    tryBounce() {
        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;
        //if (gameTime > this.springTime) { //} && !this.body.onFloor()) {
            if(body.onFloor()) {
                //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
                    //if (!player.isTouchingSpring) {
                        //if(springSound.)
                        //if (tile.alpha > 0) {
                body.velocity.y = -650;

                this.springTime = gameTime + 1000;
            }        
        //}
    }

    private createBullet() : void {

        var body = <Phaser.Physics.Arcade.Body>this.body;
        if (this.flipX) {
            this.bullets.create(body.x, body.y + this.getBulletOffsetY(), "playerGunBullet").body.setVelocityX(-600).setVelocityY(0);
        }
        else {
            this.bullets.create(body.x + 66, body.y + this.getBulletOffsetY(), "playerGunBullet").body.setVelocityX(600).setVelocityY(0);
        }
    }

    getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    tryDamage(): void {
        if(this.hurtTime == 0) {
            if(this.health > 0) {
                this.health--;
                this.scene.events.emit("playerHealthUpdated", this.health);
                this.scene.sound.play("hurtSound");
                this.hurtTime = 60;
            }
        }
    }

    getGunOffsetY() : number {
        var offsetY = Constants.playerGunOffsetY;
        if(this.isDucking) {
            offsetY += Constants.playerDuckingGunOffsetY;
        }

        return offsetY;
    }

    getBulletOffsetY() : number {
        var offsetY = 45;
        if(this.isDucking) {
            offsetY += Constants.playerDuckingGunOffsetY;
        }

        return offsetY;
    }

    update(): void {

        this.isInWater = false;
        if(this.hurtTime > 0) {
            this.hurtTime--;
            if(this.hurtTime > 30)
                this.setAlpha(0.5);
            else
                this.setAlpha(1);
        }
       
        if(this.flipX) {
            this.playerGun.setFlipX(true);          
            this.playerGun.setPosition(this.x + Constants.playerGunOffsetXFacingLeft, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }       
        else {
            this.playerGun.setFlipX(false);
            this.playerGun.setPosition(this.x + Constants.playerGunOffsetXFacingRight, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }        
    }
}