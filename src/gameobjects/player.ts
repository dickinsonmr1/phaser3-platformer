/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>
import { Constants } from "../constants";
import "phaser";
import { Scene } from "phaser";
import { Bullet } from "./bullet";
import { Switch } from "./switch";
import { Spaceship } from "./spaceship";
import { Portal } from "./portal";
import { Weapon, LaserRepeater } from "./weapon";
import { MainScene } from "../scenes/mainScene";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    
    public playerGun: any;//Phaser.Physics.Arcade.Image;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private moveKeyLeft: Phaser.Input.Keyboard.Key;
    private moveKeyRight: Phaser.Input.Keyboard.Key;
    private shootingKey: Phaser.Input.Keyboard.Key;
    private jumpingKey: Phaser.Input.Keyboard.Key;

    private static get playerGunOffsetXFacingLeft(): number {return -5;}
    private static get playerGunOffsetY(): number {return 100;}
    private static get playerGunOffsetXFacingRight(): number {return 70;}  
    private static get playerOffsetXInSpaceship(): number {return -17;}  
    private static get playerOffsetYInSpaceship(): number {return -80;}  

    private get GetTextOffsetY(): number { return -100; }
    
    private get GetIconOffsetX(): number { return -60; }
    private get GetIconOffsetY(): number { return this.GetTextOffsetY + 2; }

    private interactText: Phaser.GameObjects.Text;
    private interactButtonImage: Phaser.GameObjects.Image;
    private activateInteractTime: number;
    private currentInteractionItem: Phaser.GameObjects.Sprite;

    private static get playerJumpVelocityY(): number {return 400;}  
    private static get playerRunVelocityX(): number{return 400;}  
    private get playerBulletVelocityX(): number
    {
        return this.currentWeapon.bulletVelocityX;
    }  

    private get currentWeaponBulletName(): string
    {
        return this.currentWeapon.bulletName;
    }  

    private get currentWeaponSoundName(): string
    {
        return this.currentWeapon.weaponSoundName;
    }  

    private get currentWeaponDamage(): number
    {
        return this.currentWeapon.weaponDamage;
    }  

    private playerBulletOffsetX(): number {
        if(this.flipX)
            return -30;
        else
            return 66;
    }  
    private get playerStandingBulletOffsetY(): number
    {
       return this.currentWeapon.playerStandingBulletOffsetY;
    }  

    private get bulletTimeInterval(): number
    {
        return this.currentWeapon.bulletTimeInterval;
    }  

    // game objects
    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    public bulletTime: number;
    
    private playerPrefixes = ['alienBeige', 'alienBlue', 'alienGreen', 'alienPink', 'alienYellow'];

    public hasBlueKey: boolean;
    public isInWater: boolean;
    public get isInSpaceship(): boolean {
        return this.currentSpaceship != null;
    }
    public isDucking: boolean;
    public hurtTime: number;
    public health: number;

    public static get maxHealth(): number { return 8; }

    public gemsCollected: number;
    //public ammoCount: number;

    public isTouchingSpring: boolean;
    public springTime: number;

    //public currentWeaponType: WeaponType;
    public currentWeapon: Weapon;

    public currentSpaceship: Spaceship;

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
        this.health = Player.maxHealth;
        this.gemsCollected = 0;
        //this.ammoCount = 5;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;
        this.isDucking = false;
        this.currentSpaceship = null;

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
        this.interactButtonImage.setDepth(4);

        this.activateInteractTime = 0;
        this.hideInteractTextAndImage();
        this.currentInteractionItem = null;

        this.currentWeapon = new LaserRepeater();
        this.playerGun = this.scene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, 'playerGun')        

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

    moveLeft(): void {

        if(!this.isInSpaceship) {
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
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityX(-Spaceship.spaceshipVelocity);
        }
    }

    moveRight(): void {
        if(!this.isInSpaceship) {

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
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityX(Spaceship.spaceshipVelocity);
        }
    }

    duck(): void {
        if(!this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body.onFloor())
            {
                this.anims.play('player-duck', true);
                this.isDucking = true;
            }
        }
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityY(Spaceship.spaceshipVelocity);
        }
    }

    stand(): void {
        if(!this.isInSpaceship) {
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
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityX(0);
            body.setVelocityY(0);
        }        
    }

    tryJump(sound): void {
        if(!this.isInSpaceship) {

            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body.onFloor()) {
                body.setVelocityY(-Player.playerJumpVelocityY);
                this.anims.play('player-jump', true);
                sound.play("jumpSound");
            }
        }
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityY(-Spaceship.spaceshipVelocity);
        }
    }

    tryMoveUp(): void {
        if(this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityY(-Spaceship.spaceshipVelocity);
        }
    }

    reload(weapon: Weapon) {
        //this.ammoCount = ammoCount;
        this.currentWeapon = weapon;
        this.playerGun.alpha = 1.0;
    }

    tryFireBullet(gameTime: number, sound): void {
        if(!this.isInSpaceship) {
            if (gameTime > this.bulletTime) {

                if(this.currentWeapon.currentAmmo > 0 ) {
                    this.createBullet();
                    this.bulletTime = gameTime + this.bulletTimeInterval;
                    this.currentWeapon.currentAmmo--;
                    sound.play(this.currentWeaponSoundName);
                    this.scene.events.emit("weaponFired", this.currentWeapon.currentAmmo);
    
                    //if(this.ammoCount < 3) 
                        //this.scene.sound.play("lowAmmoSound");            
    
                    if(this.currentWeapon.currentAmmo == 0) {
                        this.playerGun.alpha = 0.0;
                        this.scene.sound.play("noAmmoSound");
                    }
                }            
            }
        } else{
            // TODO: add spaceship specific weapon
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

    tryEnterSpaceship(spaceship: Spaceship) {
        if(!this.isInSpaceship && spaceship.transitionTime == 0) {

            var gameTime = this.scene.game.loop.time;
            var body = <Phaser.Physics.Arcade.Body>this.body;
    
            this.currentSpaceship = spaceship;

            this.visible = false;
            this.playerGun.visible = false;
            body.x = this.currentSpaceship.x + Player.playerOffsetXInSpaceship;
            body.y = this.currentSpaceship.y + Player.playerOffsetYInSpaceship;
        }        
    }

    tryExitSpaceship(spaceship: Spaceship) {

        if(this.currentSpaceship != null) {
            
            this.currentSpaceship.turnOff();

            this.currentSpaceship = null;

            this.visible = true;
            this.playerGun.visible = true;

            this.exitSpaceship(this.scene.sound);
        }
    }

    private exitSpaceship(sound): void {
        var body = <Phaser.Physics.Arcade.Body>this.body;
        body.setVelocityY(-Player.playerJumpVelocityY);
        this.anims.play('player-jump', true);
        sound.play("jumpSound");
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
            damage: this.currentWeaponDamage,
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

    tryHeal(): void {
        if(this.health < Player.maxHealth) {
            this.health++;
            this.scene.events.emit("playerHealthUpdated", this.health);
            //this.scene.sound.play("hurtSound");
            //this.hurtTime = 60;
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

    setAvailableInteraction(item: Phaser.GameObjects.Sprite) {        
        this.currentInteractionItem = item;
    }

    tryInteract() {
        if(this.currentInteractionItem != null) {

            if (this.currentInteractionItem instanceof Switch) {

                let item = <Switch>this.currentInteractionItem;
                item.toggle();
                // do something
            }
            if (this.currentInteractionItem instanceof Spaceship) {

                let item = <Spaceship>this.currentInteractionItem;
                item.turnOn();
                this.tryEnterSpaceship(this.currentInteractionItem)
                this.hideInteractTextAndImage();
                // do something
            }
            if (this.currentInteractionItem instanceof Portal) {

                let item = <Portal>this.currentInteractionItem;
                let destinationName = item.destinationName;

                let scene = <MainScene>this.scene;
                scene.sceneController.warpViaPortal(destinationName);
                //item.activate();
                // do something
            }
        }            
    }

    update(): void {

        if(this.isInSpaceship) {

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.x = this.currentSpaceship.x + Player.playerOffsetXInSpaceship;
            body.y = this.currentSpaceship.y + Player.playerOffsetYInSpaceship;
        }

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