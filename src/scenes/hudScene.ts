/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Player } from "../gameobjects/player";
 import { Constants } from "../constants";
 import { HealthBar } from "./healthBar";
 import { SceneController } from "./sceneController";
 
 export class HudScene extends Phaser.Scene {
    sceneController: SceneController;
    // HUD
    hudComponent: HUDComponent;

    private get PlayerIconX(): number { return this.game.canvas.width / 2 - 64 - 50; }
    private get HeartStartX(): number { return this.PlayerIconX + 100; }
    private get HeartOffsetX(): number { return 50; }

    private get fontSize(): number { return 48; }

    private get GemIconX(): number { return 150; }
    private get GemTextOffsetX(): number { return 120; }

    private get WeaponIconX(): number { return 1600; }
    private get AmmoTextOffsetX(): number { return 200; }
    
    private get HudBaseOffsetY(): number { return 100; }
    private get AmmoTextOffsetY(): number { return 0; }

    private get InfoTextStartX(): number {return this.game.canvas.width / 2; }
    private get InfoTextStartY(): number {return this.game.canvas.height - this.game.canvas.height / 4; }   
    private get infoTextFontSize(): number { return 48; }

    constructor(sceneController: SceneController) {
        super({
            key: "HudScene"
        });
        this.sceneController = sceneController;
    }
        
    preload(): void {
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
        this.load.atlasXML('uiSpaceSprites', './assets/sprites/HUD/uipackSpace_sheet.png', './assets/sprites/HUD/uipackSpace_sheet.xml');        
        this.load.atlasXML('redUISprites', './assets/sprites/HUD/redSheet.png', './assets/sprites/HUD/redSheet.xml');        
        this.load.atlasXML('greyUISprites', './assets/sprites/HUD/greySheet.png', './assets/sprites/HUD/greySheet.xml');        
        this.load.image('weaponIcon', './assets/sprites/player/raygunPurpleBig.png');

        this.load.image('healthBarLeft', './assets/sprites/HUD/barHorizontal_red_left.png');
        this.load.image('healthBarMid', './assets/sprites/HUD/barHorizontal_red_mid.png');
        this.load.image('healthBarRight', './assets/sprites/HUD/barHorizontal_red_right.png');
    }

    public healthBarHealth = 100;
    public healthBar: HealthBar;

    create(): void {

        this.hudComponent = new HUDComponent();
        this.hudComponent.playerHudIcon = this.add.sprite(this.PlayerIconX, this.HudBaseOffsetY, 'hudSprites', 'hudPlayer_blue.png');
        this.hudComponent.playerHudIcon.setScrollFactor(0);

        this.hudComponent.heart1 = this.add.image(this.HeartStartX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart1.setScale(0.5);

        this.hudComponent.heart2 = this.add.sprite(this.HeartStartX + this.HeartOffsetX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart2.setScale(0.5);
        
        this.hudComponent.heart3 = this.add.sprite(this.HeartStartX + this.HeartOffsetX * 2, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart3.setScale(0.5);
        
        this.hudComponent.heart4 = this.add.sprite(this.HeartStartX + this.HeartOffsetX * 3, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart4.setScale(0.5);

        this.hudComponent.heartHalf1 = this.add.image(this.HeartStartX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf1.setScale(0.5);

        this.hudComponent.heartHalf2 = this.add.sprite(this.HeartStartX + this.HeartOffsetX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf2.setScale(0.5);
        
        this.hudComponent.heartHalf3 = this.add.sprite(this.HeartStartX + this.HeartOffsetX * 2, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf3.setScale(0.5);
        
        this.hudComponent.heartHalf4 = this.add.sprite(this.HeartStartX + this.HeartOffsetX * 3, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf4.setScale(0.5);
               
        this.hudComponent.heartEmpty1 = this.add.image(this.HeartStartX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty1.setScale(0.5);

        this.hudComponent.heartEmpty2 = this.add.image(this.HeartStartX + this.HeartOffsetX, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty2.setScale(0.5);

        this.hudComponent.heartEmpty3 = this.add.image(this.HeartStartX + this.HeartOffsetX * 2, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty3.setScale(0.5);

        this.hudComponent.heartEmpty4 = this.add.image(this.HeartStartX + this.HeartOffsetX * 3, this.HudBaseOffsetY, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty4.setScale(0.5);

        this.hudComponent.gem = this.add.image(this.GemIconX, this.HudBaseOffsetY, 'hudSprites', 'hudJewel_green.png');
        this.hudComponent.gem.setScale(1.0);

        this.hudComponent.gemCountText = this.add.text(this.GemIconX + this.GemTextOffsetX, this.HudBaseOffsetY + this.AmmoTextOffsetY, '0',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.fontSize,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.gemCountText.setOrigin(0, 0.5);
        this.hudComponent.gemCountText.setStroke('rgb(0,0,0)', 16);

        this.hudComponent.weapon = this.add.image(this.WeaponIconX, this.HudBaseOffsetY, 'weaponIcon');
        this.hudComponent.weapon.setScale(2.0, 2.0);
        this.hudComponent.ammoText = this.add.text(this.WeaponIconX + this.AmmoTextOffsetX, this.HudBaseOffsetY + this.AmmoTextOffsetY, '5',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.fontSize,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.ammoText.setStroke('rgb(0,0,0)', 16);
        this.hudComponent.ammoText.setOrigin(1, 0.5);

        this.hudComponent.infoText = this.add.text(this.InfoTextStartX, this.InfoTextStartY, 'test',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.infoTextFontSize,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.infoText.setOrigin(0.5, 0.5);
        this.hudComponent.infoText.setStroke('rgb(0,0,0)', 16);
        this.hudComponent.infoTextExpiryGameTime = this.game.getTime();
        
        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('MainScene');

        //  Listen for events from it
        ourGame.events.on('playerHealthUpdated', function (health) {
            this.setHealth(health);
            this.updateHealthBar(health);
        }, this);

        //  Listen for events from it
        ourGame.events.on('playerHurt', function () {
            this.setHealth(1);
        }, this);

        //  Listen for events from it
        ourGame.events.on('gemCollected', function (gemCount) {
            this.setGemCount(gemCount);
        }, this);

        ourGame.events.on('weaponFired', function (playerAmmoCount) {
            this.setammoCount(playerAmmoCount);
        }, this);

        ourGame.events.on('weaponCollected', function (ammoCount) {
            this.setammoCount(ammoCount);
        }, this);

        ourGame.events.on('enemyDamage', function (x, y, damage) {
            this.emitExpiringText(x, y, damage);
        }, this);
        
        //  Listen for events from it
        ourGame.events.on('infoTextEmitted', function (text) {
            this.setInfoText(text);
        }, this);

        var maxHealth = 8;
        this.setHealth(maxHealth);
        
        this.healthBar = new HealthBar(this);
        this.healthBar.init(this.HeartStartX - 20, this.HudBaseOffsetY + 50, maxHealth,
            200, 30);

        this.healthBar.updateHealth(maxHealth);

        this.scene.setVisible(false);
    }

    setHealth(health: number): void {        
        this.hudComponent.heartHalf1.visible = (health == 1);
        this.hudComponent.heart1.visible = (health >= 2);        
        this.hudComponent.heartHalf2.visible = (health == 3);
        this.hudComponent.heart2.visible = (health >= 4);        
        this.hudComponent.heartHalf3.visible = (health == 5);
        this.hudComponent.heart3.visible = (health >= 6);
        this.hudComponent.heartHalf4.visible = (health == 7);
        this.hudComponent.heart4.visible = (health == 8);   

        this.hudComponent.heartEmpty1.visible = (health == 0);
        this.hudComponent.heartEmpty2.visible = (health < 3);
        this.hudComponent.heartEmpty3.visible = (health < 5);
        this.hudComponent.heartEmpty4.visible = (health < 7);
    }

    updateHealthBar(health: number) {
        this.healthBar.updateHealth(health);
    }

    setGemCount(gemCount: number): void {
        this.hudComponent.gemCountText.setText(gemCount.toString());
    }
    
    setammoCount(ammo: number): void {
        this.hudComponent.ammoText.setText(ammo.toString());
        if(ammo <= 0)
            this.hudComponent.ammoText.setColor("rgb(255,50,50)")
        else
            this.hudComponent.ammoText.setColor("rgb(255,255,255)")
    }

    setInfoText(text: string, infoTextDurationInMs: number): void {
        this.hudComponent.infoText.setText(text);
        this.hudComponent.infoTextAlpha = 1;
        this.hudComponent.infoTextExpiryGameTime = this.game.getTime() + infoTextDurationInMs;

        this.hudComponent.infoText.setAlpha(this.hudComponent.infoTextAlpha);
    }
   
    update(): void {
        if(this.game.getTime() > this.hudComponent.infoTextExpiryGameTime) {
            if(this.hudComponent.infoTextAlpha > 0) {
                this.hudComponent.infoTextAlpha -= 0.01;
                this.hudComponent.infoText.setAlpha(this.hudComponent.infoTextAlpha);
            }
        } 
    }
}

export class HUDComponent {
    hudGroup: Phaser.GameObjects.Group;
    playerHudIcon: Phaser.GameObjects.Image;
    heart1: Phaser.GameObjects.Image;
    heart2: Phaser.GameObjects.Image;
    heart3: Phaser.GameObjects.Image;
    heart4: Phaser.GameObjects.Image;
    heartHalf1: Phaser.GameObjects.Image;
    heartHalf2: Phaser.GameObjects.Image;
    heartHalf3: Phaser.GameObjects.Image;
    heartHalf4: Phaser.GameObjects.Image;
    heartEmpty1: Phaser.GameObjects.Image;
    heartEmpty2: Phaser.GameObjects.Image;
    heartEmpty3: Phaser.GameObjects.Image;
    heartEmpty4: Phaser.GameObjects.Image;
    gem: Phaser.GameObjects.Image;
    digit10000: Phaser.GameObjects.Image;
    digit1000: Phaser.GameObjects.Image;
    digit100: Phaser.GameObjects.Image;
    digit10: Phaser.GameObjects.Image;
    digit1: Phaser.GameObjects.Image;
    number0: Phaser.GameObjects.Image;
    number1: Phaser.GameObjects.Image;
    number3: Phaser.GameObjects.Image;
    number4: Phaser.GameObjects.Image;
    number5: Phaser.GameObjects.Image;
    number6: Phaser.GameObjects.Image;
    number7: Phaser.GameObjects.Image;
    number8: Phaser.GameObjects.Image;
    number9: Phaser.GameObjects.Image;
    gemCountText: Phaser.GameObjects.Text;
    
    weapon: Phaser.GameObjects.Image;
    ammoText: Phaser.GameObjects.Text;

    healthBar: HealthBar;
   
    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;
}