/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */
import { Constants } from "./constants";
import "phaser";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    public sprite: Phaser.Physics.Arcade.Sprite;
    public playerGun: any;//Phaser.Physics.Arcade.Image;
    private currentScene: Phaser.Scene;

    private cursors: Phaser.Input.Keyboard.CursorKeys;
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

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.currentScene = params.scene;
        
        this.setFlipX(false);

        // physics
        this.width = 128;
        this.height = 256;
        
        this.currentScene.physics.world.enable(this);

        this.displayWidth = 64;
        this.displayHeight = 128;                   

        this.body.maxVelocity.x = 500;
        this.body.maxVelocity.y = 500;
        this.body
            .setSize(64, 128)
            .setOffset(Constants.playerOffsetX, Constants.playerOffsetY);    

        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.setScale(0.75, 0.75);

        this.currentScene.add.existing(this);
    
        this.hasBlueKey = false;
        this.isInWater = false;

        this.hurtTime = 0;
        this.health = 8;
        this.gemsCollected = 0;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;
        this.isDucking = false;

        this.playerGun = this.currentScene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, 'playerGun')        
        //this.bullets = this.currentScene.add.group();
        
        return;        
    } 

    private initImage(input: Phaser.Input.InputPlugin) {       
        // input
        this.cursors = input.keyboard.createCursorKeys();
        this.moveKeyLeft = this.currentScene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
        );
        this.moveKeyRight = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
        );
        this.shootingKey = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.CTRL
        );
        this.jumpingKey = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    processinput(): void {

    }

    moveLeft(): void {
        this.body.setVelocityX(-300); // move left
            
            if(this.isInWater) {
                this.anims.play('swim', true);
            }
            else {
                if(this.body.onFloor()) {         
                    this.anims.play('walk', true);
                }
                else {
                    this.anims.play('jump', true);
                }
            }
            
            this.flipX = true; // flip the sprite to the left 
    }

    moveRight(): void {
        this.body.setVelocityX(300); // move right

        if(this.isInWater) {
            this.anims.play('swim', true);
        }
        else {
            if(this.body.onFloor()) {
                this.anims.play('walk', true);
            }
            else {
                this.anims.play('jump', true);
            }
        }

        this.flipX = false; // use the original sprite looking to the right
    }

    duck(): void {
        if(this.body.onFloor())
        {
            this.anims.play('duck', true);
            this.isDucking = true;
        }
    }

    stand(): void {
        this.isDucking = false;
        this.body.setVelocityX(0);
        if(this.body.onFloor())
        {
            this.anims.play('idle', true);
        }
        else
        {
            this.anims.play('jump', true);
        }
    }

    tryJump(sound): void {
        if(this.body.onFloor()) {
            this.body.setVelocityY(-400);
            this.anims.play('jump', true);
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

    tryBounce(gameTime: number, sound) {
        if (gameTime > this.springTime) { //} && !this.body.onFloor()) {
            //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
            //if (!player.isTouchingSpring) {
                //if(springSound.)
                //if (tile.alpha > 0) {
                this.body.velocity.y = -650;
                sound.play("springSound");
    
                this.springTime = gameTime + 1000;
            }
    }

    private createBullet() : void {
        if (this.flipX) {
            this.bullets.create(this.body.x, this.body.y + this.getBulletOffsetY(), "playerGunBullet").body.setVelocityX(-600).setVelocityY(0);
        }
        else {
            this.bullets.create(this.body.x + 66, this.body.y + this.getBulletOffsetY(), "playerGunBullet").body.setVelocityX(600).setVelocityY(0);
        }
    }

    getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
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