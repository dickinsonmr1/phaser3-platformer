/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>

import { Constants } from "../client/constants";
import "phaser";
import { Scene } from "phaser";
import { Bullet } from "./bullet";
import { Switch } from "./switch";
import { Spaceship } from "./spaceship";
import { Portal } from "./portal";
import { Weapon, LaserRepeater, RocketLauncher } from "./weapon";
import { HealthBar } from "../client/scenes/healthBar";
import { MainScene } from "../client/scenes/mainScene";
import { Socket } from "socket.io-client";
import { timeStamp } from "console";

// TODO: fix and move implementation here once basic player functionality is working in main scene
export class Player extends Phaser.GameObjects.Sprite {
    
    public playerGun: any;//Phaser.Physics.Arcade.Image;

    private static get playerGunOffsetXFacingLeft(): number {return -5;}
    private static get playerGunOffsetY(): number {return 100;}
    private static get playerGunOffsetXFacingRight(): number {return 70;}  
    private static get playerOffsetXInSpaceship(): number {return -17;}  
    private static get playerOffsetYInSpaceship(): number {return -80;}  

    private get GetTextOffsetY(): number { return -100; }
    
    private get GetIconOffsetX(): number { return -60; }
    private get GetIconOffsetY(): number { return this.GetTextOffsetY + 2; }

    private get GetShieldOffsetX(): number { return 32; }
    private get GetShieldOffsetY(): number { return 80; }

    private interactText: Phaser.GameObjects.Text;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetX(): number { return -20; }
    private get GetPlayerNameOffsetY(): number { return -10; }

    private interactButtonImage: Phaser.GameObjects.Image;
    private activateInteractTime: number;
    private currentInteractionItem: Phaser.GameObjects.Sprite;

    private shieldBubble: Phaser.GameObjects.Sprite;

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

    private get currentWeaponTint(): number
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
    public shieldReloadTime: number;
    public shieldDrainTime: number;
    public health: number;
    public shieldHealth: number;

    public multiplayerHealthBar: HealthBar;
    private get healthBarOffsetX(): number {return -20;}
    private get healthBarOffsetY(): number {return 10;}

    public static get maxHealth(): number { return 4; }
    public static get maxShield(): number { return 4; }

    public gemsCollected: number;
    public score: number;
    public enemiesKilled: number;

    public isTouchingSpring: boolean;
    public springTime: number;

    //public currentWeaponType: WeaponType;
    public currentWeapon: Weapon;

    public currentSpaceship: Spaceship;

    public xPrevious: number;
    public yPrevious: number;
    public isMyPlayer: boolean;
    public isMultiplayer: boolean;

    public getScene(): Scene {
        return this.scene;
    }

    public playerId: string;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.playerId = params.playerId;
        this.isMyPlayer = params.isMyPlayer;
        this.isMultiplayer = params.isMultiplayer;
    } 

    public init(): void {
        this.setFlipX(false);

        //this.bullets = this.scene.add.group({            
            //runChildUpdate: true,            
            //active: true
        //});
    
        //this.bullets.runChildUpdate = true;
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

        // multiplayer health bar
        this.multiplayerHealthBar = new HealthBar(this.getScene());
        this.multiplayerHealthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            Player.maxHealth, 
            100, 15, false);
        this.multiplayerHealthBar.setDepth(Constants.depthHealthBar);
        if(this.isMultiplayer)
            this.multiplayerHealthBar.show();
        else
            this.multiplayerHealthBar.hide();

        // multiplayer player name text
        var playerNameText = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.playerId,
            {
                fontFamily: 'KenneyRocketSquare',         
                color:"rgb(255,255,255)",
            });
        playerNameText.setAlpha(0.5);
        playerNameText.setOrigin(0, 0.5);
        playerNameText.setDepth(7);
        playerNameText.setStroke('rgb(0,0,0)', 4);     
        playerNameText.setFontSize(24); 
        
        this.multiplayerNameText = playerNameText;
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
        this.multiplayerNameText.setOrigin(0, 0.5);
        this.multiplayerNameText.setFontSize(16);
        this.multiplayerNameText.setVisible(this.isMultiplayer);

        this.shieldHealth = 0;//Player.maxHealth;
        this.shieldReloadTime = 0;
        this.shieldDrainTime = 0;


        this.gemsCollected = 0;
        this.score = 0;
        this.enemiesKilled = 0;
        this.bulletTime = 0;
        this.lastUsedBulletIndex = 0;
        this.springTime = 0;
        this.isDucking = false;
        this.currentSpaceship = null;

        var text = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "Interact",
        {
            fontFamily: 'KenneyRocketSquare',        
            color:"rgb(255,255,255)",
        });
        text.setAlpha(0);
        text.setOrigin(0, 0.5);
        text.setDepth(7);
        text.setStroke('rgb(0,0,0)', 4);        
        text.setFontSize(24);        

        this.interactText = text;

        this.interactButtonImage = this.scene.add.image(text.x - text.width, this.y - this.GetIconOffsetY, 'buttonX');
        this.interactButtonImage.alpha = 0;
        this.interactButtonImage.setOrigin(0, 0.5);
        this.interactButtonImage.setDepth(Constants.depthPlayer);

        this.activateInteractTime = 0;
        this.hideInteractTextAndImage();
        this.currentInteractionItem = null;

    

        this.currentWeapon = new RocketLauncher();
        this.playerGun = this.scene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, this.currentWeapon.weaponTextureName);
        
        this.shieldBubble = this.scene.add.sprite(Constants.playerOffsetX, Constants.playerOffsetY, "playerShield");
        this.shieldBubble.setScale(0.2, 0.2);
        this.shieldBubble.setOrigin(0.5, 0.5);
        this.shieldBubble.setDepth(Constants.depthHealthBar);
        this.shieldBubble.setTint(0x32ABFA);

        this.reload(this.currentWeapon);
        let scene = <MainScene>this.scene;
        scene.events.emit("weaponCollected", this.currentWeapon.currentAmmo, this.currentWeapon.weaponTextureName);    
        
        //.setTint(0xff0000);

        this.xPrevious = this.x;
        this.yPrevious = this.y;

        return;        
    }

    moveX(multiplier: number): void {
        if(!this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.setVelocityX(Player.playerRunVelocityX * multiplier); // move left
                
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
            
            this.flipX = (multiplier < 0); // flip the sprite to the left 
        }
        else {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityX(Spaceship.spaceshipVelocity * multiplier);
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
    
    tryMoveDown(): void {
        if(this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityY(Spaceship.spaceshipVelocity);
        }
    }

    tryMoveSpaceship(leftAxisX: number, leftAxisY: number): void {
        if(this.isInSpaceship) {
            var spaceShipBody = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            spaceShipBody.setVelocity(Spaceship.spaceshipVelocity * leftAxisX, Spaceship.spaceshipVelocity * leftAxisY);
            
            var playerBody = <Phaser.Physics.Arcade.Body>this.body;
            playerBody.setVelocity(spaceShipBody.velocity.x, spaceShipBody.velocity.y);            
        }
    }

    tryStopSpaceShipX(): void {
        if(this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityX(0);
        }
    }
    
    tryStopSpaceShipY(): void {
        if(this.isInSpaceship) {
            var body = <Phaser.Physics.Arcade.Body>this.currentSpaceship.body;
            body.setVelocityY(0);
        }
    }

    reload(weapon: Weapon) {
        //this.ammoCount = ammoCount;
        this.currentWeapon = weapon;
        this.playerGun.alpha = 1.0;

        var temp  = <Phaser.GameObjects.Sprite> this.playerGun;
        temp.setTexture(this.currentWeapon.weaponTextureName);
    }

    tryFireBullet(gameTime: number, sound): void {
        if(!this.isInSpaceship) {
            if (gameTime > this.bulletTime) {

                if(this.currentWeapon.currentAmmo > 0 ) {
                    var bullet = this.createBullet();
                    this.bulletTime = gameTime + this.bulletTimeInterval;
                    this.currentWeapon.currentAmmo--;
                    sound.play(this.currentWeaponSoundName);
                    this.scene.events.emit("weaponFired", this.currentWeapon.currentAmmo);

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
                    }
                }            
            }
        } else{
            // TODO: add spaceship specific weapon
            this.currentSpaceship.tryFireWeapon();
        }       
    }

    tryBounceUp() {
        
        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;
        //if (gameTime > this.springTime) { //} && !this.body.onFloor()) {
            //if(body.onFloor()) {
                //if (!this.playerBox.isInSpaceShip && !this.playerBox.isTouchingSpring) {
                    //if (!player.isTouchingSpring) {
                        //if(springSound.)
                        //if (tile.alpha > 0) {
        body.velocity.y = -650;

        if(this.springTime == 0)
            this.scene.sound.play("springSound");     
  
        this.springTime = 30; //gameTime + 1000;        
    }

    tryBounceDown() {

        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;        
        body.velocity.y = 650;

        if(this.springTime == 0)          
            this.scene.sound.play("springSound");                   

        this.springTime = 30; //gameTime + 1000;
    }

    tryBounceLeft() {
        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;        
        body.velocity.x = -650;

        if(this.springTime == 0)          
            this.scene.sound.play("springSound");                   
            
        this.springTime = 30; //gameTime + 1000;
    }

    tryBounceRight() {
        var gameTime = this.scene.game.loop.time;
        var body = <Phaser.Physics.Arcade.Body>this.body;        
        body.velocity.x = 650;

        if(this.springTime == 0)          
            this.scene.sound.play("springSound");                   
            
        this.springTime = 30; //gameTime + 1000;
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

            if(this.isMultiplayer)            
                this.multiplayerHealthBar.hide();
        }        
    }

    tryExitSpaceship() {

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

        if(this.isMultiplayer)
            this.multiplayerHealthBar.show();
    }


    private createBullet() : Bullet {

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

    getBullets(): Phaser.GameObjects.Group {        
        return this.bullets;
    }

    tryDamage(): void {
        if(this.hurtTime == 0) {
            if(this.shieldHealth > 0) {
                
                this.shieldHealth--;
                this.scene.events.emit("playerShieldUpdated", this.playerId, this.shieldHealth);
                //this.healthBar.updateHealth(this.health);
                
                this.hurtTime = 60;

                if(this.shieldHealth <= 0) {
                    this.scene.sound.play("shieldDrainSound");
                    this.shieldDrainTime = 20;
                }
            }
            else if(this.health > 0) {
                this.health--;
                this.scene.events.emit("playerHealthUpdated", this.playerId, this.health);

                this.scene.sound.play("hurtSound");
                this.hurtTime = 60;
                this.multiplayerHealthBar.updateHealth(this.health);
            }
        }
    }

    tryHeal(): void {
        if(this.health < Player.maxHealth) {
            this.health++;
            this.scene.events.emit("playerHealthUpdated", this.playerId, this.health);
            //this.scene.sound.play("hurtSound");
            //this.hurtTime = 60;
        }
    }

    tryRechargeShield(): void {
        
        if(this.shieldHealth < Player.maxShield) {
            this.shieldHealth = Player.maxShield;
            this.scene.events.emit("playerShieldUpdated", this.playerId, this.shieldHealth);
            this.shieldReloadTime = 20;
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

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0.5);
    }

    displayInteractTextAndImage(x: number, y: number) {
        
        this.alignInteractTextAndImage(x, y);

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

                var sound = (<MainScene>this.getScene()).sound;
                sound.play("healthSound");
                //item.activate();
                // do something
            }
        }            
    }
    
    getSocket(): Socket {
        let scene = <MainScene>this.scene;            
        return scene.sceneController.socketClient.socket;
    }

    anythingChanged(): boolean {
        return this.xPrevious != this.x || this.yPrevious != this.y;
        // TODO: other items like flipX
    }

    update(): void {

        if(this.isInSpaceship) {

            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.x = this.currentSpaceship.x + Player.playerOffsetXInSpaceship;
            body.y = this.currentSpaceship.y + Player.playerOffsetYInSpaceship;

            body.setVelocity(this.currentSpaceship.body.velocity.x, this.currentSpaceship.body.velocity.y);

            this.shieldBubble.setVisible(false);
        }
        else {
            this.multiplayerHealthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);

            this.shieldBubble.setVisible(this.shieldHealth > 0 || (this.shieldHealth == 0 && this.shieldDrainTime > 0));
        }


        this.isInWater = false;
        if(this.hurtTime > 0) {
            
            this.hurtTime--;
            if(this.hurtTime > 30)
                if(this.shieldHealth > 0)
                    this.shieldBubble.setAlpha(0.5);                    
                else   
                    this.setAlpha(0.5);    
            else
                if(this.shieldHealth > 0)
                    this.shieldBubble.setAlpha(1);
                else   
                    this.setAlpha(1);    
        }

        if(this.shieldReloadTime > 0) {
            this.shieldReloadTime--;

            let scale = 0.8 - (this.shieldReloadTime) * .03;
            this.shieldBubble.setScale(scale, scale);
        }

        if(this.shieldDrainTime > 0) {
            this.shieldDrainTime--;

            let scale = 0.8 * (this.shieldDrainTime / 20);
            this.shieldBubble.setScale(scale, scale);
        }

        if(this.activateInteractTime > 0)
            this.activateInteractTime--;
        else {// if(this.activateInteractTime == 0) {
            this.currentInteractionItem = null;
            this.hideInteractTextAndImage();
        }

        if(this.springTime > 0)
            this.springTime--;
       
        if(this.flipX) {
            this.playerGun.setFlipX(true);          
            this.playerGun.setPosition(this.x + Player.playerGunOffsetXFacingLeft, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }       
        else {
            this.playerGun.setFlipX(false);
            this.playerGun.setPosition(this.x + Player.playerGunOffsetXFacingRight, this.y + this.getGunOffsetY());//.setOffset(32, 128);
        }   
        this.shieldBubble.setPosition(this.x + this.GetShieldOffsetX, this.y + this.GetShieldOffsetY);
        
        if(this.isMyPlayer && this.anythingChanged()) {
            var socket = this.getSocket();
            //socket.emit('playerMovement', new PlayerOnServer(50, 50, socket.id));//{ x: player.x, y: player.y });
            if(socket != null) {
                // sends back to server
                socket.emit('playerMovement', { x: this.x, y: this.y, flipX: this.flipX, animKey: this.anims.currentAnim.key});
            }
        }
        this.xPrevious = this.x;
        this.yPrevious = this.y;

        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);

        //var temp = this.bullets.children.getArray();
        //temp.forEach(item => {
            //let bullet = <Bullet>item;      
            //bullet.update(0, 0);
        //});
    }
}