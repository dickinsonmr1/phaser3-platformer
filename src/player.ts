/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="phaser.d.ts"/>
import { Constants } from "./constants";
import "phaser";
import { Scene } from "phaser";
import { Bullet } from "./bullet";
import { Switch } from "./gameobjects/switch";

export enum WeaponType {
    Laser1,
    Laser2, 
    Laser3,
    Laser4
}

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

    private static get playerGunOffsetXFacingLeft(): number {return -5;}
    private static get playerGunOffsetY(): number {return 100;}
    private static get playerGunOffsetXFacingRight(): number {return 70;}  

    private get GetTextOffsetY(): number { return -100; }
    
    private get GetIconOffsetX(): number { return -60; }
    private get GetIconOffsetY(): number { return this.GetTextOffsetY + 2; }

    private interactText: Phaser.GameObjects.Text;
    private interactButtonImage: Phaser.GameObjects.Image;
    private activateInteractTime: number;
    private currentInteractionItem: Switch;

    private static get playerJumpVelocityY(): number {return 450;}  
    private static get playerRunVelocityX(): number{return 400;}  
    private get playerBulletVelocityX(): number
    {
        switch(this.currentWeaponType) {
            case WeaponType.Laser1:
                return 700;
            case WeaponType.Laser2:
                return 900;
            case WeaponType.Laser3:
                return 900;
            case WeaponType.Laser4:
                return 1000;
        }
    }  

    private get currentWeaponBulletName(): string
    {
        switch(this.currentWeaponType) {
            case WeaponType.Laser1:
                return "playerGunLaser1";
            case WeaponType.Laser2:
                return "playerGunLaser2";
            case WeaponType.Laser3:
                return "playerGunLaser3";
            case WeaponType.Laser4:
                return "playerRocket2";
        }
    }  

    private get currentWeaponSoundName(): string
    {
        switch(this.currentWeaponType) {
            case WeaponType.Laser1:
                return "laser1Sound";
            case WeaponType.Laser2:
                return "laser2Sound";
            case WeaponType.Laser3:
                return "laser3Sound";
            case WeaponType.Laser4:
                return "laser4Sound";
        }
    }  
    private playerBulletOffsetX(): number {
        if(this.flipX)
            return -30;
        else
            return 66;
    }  
    private get playerStandingBulletOffsetY(): number
    {
        switch(this.currentWeaponType) {
            case WeaponType.Laser1:
                return 45;
            case WeaponType.Laser2:
                return 45;
            case WeaponType.Laser3:
                return 70;
            case WeaponType.Laser4:
                return 45;
        }
    }  

    private get bulletTimeInterval(): number
    {
        switch(this.currentWeaponType) {
            case WeaponType.Laser1:
                return 300;
            case WeaponType.Laser2:
                return 200;
            case WeaponType.Laser3:
                return 500;
            case WeaponType.Laser4:
                return 750;
        }
    }  

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
    public ammoCount: number;

    public isTouchingSpring: boolean;
    public springTime: number;

    public currentWeaponType: WeaponType;

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

        this.displayWidth = 128;
        this.displayHeight = 256;                   

        var body = <Phaser.Physics.Arcade.Body>this.body;

        body.maxVelocity.x = 500;
        body.maxVelocity.y = 500;
        body
            .setSize(64, 128)
            .setOffset(Constants.playerOffsetX, Constants.playerOffsetY);    

        this.displayOriginX = 0.5;
        this.displayOriginY = 0.5;

        this.setScale(Constants.playerDrawScale, Constants.playerDrawScale);

        this.scene.add.existing(this);
    
        this.hasBlueKey = false;
        this.isInWater = false;

        this.hurtTime = 0;
        this.health = 8;
        this.gemsCollected = 0;
        this.ammoCount = 5;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;
        this.isDucking = false;

        var text = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "Interact",
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 24,
            //align: 'right',            
            color:"rgb(255,255,255)",
        });
        text.setAlpha(0);
        text.setOrigin(0, 0.5);
        text.setDepth(7);
        text.setStroke('rgb(0,0,0)', 4);        

        this.interactText = text;

        this.interactButtonImage = this.scene.add.image(text.x - text.width, this.y - this.GetIconOffsetY, 'buttonX');
        this.interactButtonImage.alpha = 0;
        this.interactButtonImage.setOrigin(0, 0.5);

        this.activateInteractTime = 0;
        this.hideInteractTextAndImage();
        this.currentInteractionItem = null;

        this.currentWeaponType = WeaponType.Laser1;
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
        body.setVelocityX(-Player.playerRunVelocityX); // move left
            
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
        body.setVelocityX(Player.playerRunVelocityX); // move right

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
            body.setVelocityY(-Player.playerJumpVelocityY);
            this.anims.play('player-jump', true);
            sound.play("jumpSound");
        }
    }

    reload(ammoCount: number, weaponType: WeaponType) {
        this.ammoCount = ammoCount;
        this.currentWeaponType = weaponType;
        this.playerGun.alpha = 1.0;
    }

    tryFireBullet(gameTime: number, sound): void {
        if (gameTime > this.bulletTime) {

            if(this.ammoCount > 0 ) {
                this.createBullet();
                this.bulletTime = gameTime + this.bulletTimeInterval;
                this.ammoCount--;
                sound.play(this.currentWeaponSoundName);
                this.scene.events.emit("weaponFired", this.ammoCount);

                //if(this.ammoCount < 3) 
                    //this.scene.sound.play("lowAmmoSound");            

                if(this.ammoCount == 0) {
                    this.playerGun.alpha = 0.0;
                    this.scene.sound.play("noAmmoSound");
                }
            }            
        }
    }

    tryBounce() {
        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;
        //if (gameTime > this.springTime) { //} && !this.body.onFloor()) {
            //if(body.onFloor()) {
                //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
                    //if (!player.isTouchingSpring) {
                        //if(springSound.)
                        //if (tile.alpha > 0) {
                body.velocity.y = -650;

                this.springTime = gameTime + 1000;
            //}        
        //}
    }

    private createBullet() : void {

        var body = <Phaser.Physics.Arcade.Body>this.body;

        var velocityX: number;
        if(this.flipX)
            velocityX = -this.playerBulletVelocityX
        else
            velocityX = this.playerBulletVelocityX;

        var bullet = new Bullet({
            scene: this.scene,
            x: body.x + this.playerBulletOffsetX(),
            y: body.y + this.getBulletOffsetY(),
            key: this.currentWeaponBulletName,
            flipX: this.flipX,
            damage: 4,
            velocityX: velocityX
        });
        bullet.init();

        this.bullets.add(bullet);

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
        var offsetY = Player.playerGunOffsetY;
        if(this.isDucking) {
            offsetY += Constants.playerDuckingGunOffsetY;
        }

        return offsetY;
    }

    getBulletOffsetY() : number {
        var offsetY = this.playerStandingBulletOffsetY;
        if(this.isDucking) {
            offsetY += Constants.playerDuckingGunOffsetY;
        }

        return offsetY;
    }

    alignInteractTextAndImage(x: number, y: number) {
        var text = this.interactText;
        text.setX(x);
        text.setY(y + this.GetTextOffsetY);

        var image = this.interactButtonImage;
        image.setX(text.x - text.width * 0.3);
        image.setY(y + this.GetIconOffsetY);    
    }

    displayInteractTextAndImage(x: number, y: number) {
        
        this.alignInteractTextAndImage(x, y);

        //this.interactText.alpha = 1;
        //this.interactButtonImage.alpha = 1;
        this.activateInteractTime = 10;

        if(this.interactText.alpha < 1)
            this.interactText.alpha += 0.1;

        if(this.interactButtonImage.alpha < 1)
            this.interactButtonImage.alpha += 0.1;      
    }

    hideInteractTextAndImage() {        
        //this.interactButtonImage.alpha = 0;
        //this.interactText.alpha = 0;

        if(this.interactText.alpha > 0)
            this.interactText.alpha -= 0.1;
        
        if(this.interactButtonImage.alpha > 0)
            this.interactButtonImage.alpha -= 0.1;             
    }

    setAvailableInteraction(switchItem: Switch) {        
        this.currentInteractionItem = switchItem;
    }

    tryInteract() {
        if(this.currentInteractionItem != null)
            this.currentInteractionItem.toggle();
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

        if(this.activateInteractTime > 0)
            this.activateInteractTime--;
        else {// if(this.activateInteractTime == 0) {
            this.hideInteractTextAndImage();
        }
       
        if(this.flipX) {
            this.playerGun.setFlipX(true);          
            this.playerGun.setPosition(this.x + Player.playerGunOffsetXFacingLeft, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }       
        else {
            this.playerGun.setFlipX(false);
            this.playerGun.setPosition(this.x + Player.playerGunOffsetXFacingRight, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }         

        this.currentInteractionItem = null;
    }
}