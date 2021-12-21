/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

 import "phaser";
import { ExpiringText } from "../../gameobjects/expiringText";
 import { Player } from "../../gameobjects/player";
 import { Constants } from "../constants";
 import { HealthBar } from "./healthBar";
 import { SceneController } from "./sceneController";
 
 export class HudScene extends Phaser.Scene {
    sceneController: SceneController;
    // HUD
    hudComponent: HUDComponent;

    private get PlayerIconX(): number { return this.game.canvas.width / 2 - 64 - 50; }
    private get HealthBarStartX(): number { return this.PlayerIconX + 80; }
    //private get HealthBarOffsetX(): number { return 50; }

    private get ShieldBarStartX(): number { return this.PlayerIconX + 95; }
    //private get ShieldBarOffsetX(): number { return 40; }

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

    private playerId: string;

    constructor(sceneController: SceneController) {
        super({
            key: "HudScene"
        });
        this.sceneController = sceneController;
    }

    restart(): void {
        this.scene.restart();
    }
        
    preload(): void {
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
        this.load.atlasXML('uiSpaceSprites', './assets/sprites/HUD/uipackSpace_sheet.png', './assets/sprites/HUD/uipackSpace_sheet.xml');        
        this.load.atlasXML('redUISprites', './assets/sprites/HUD/redSheet.png', './assets/sprites/HUD/redSheet.xml');        
        this.load.atlasXML('greyUISprites', './assets/sprites/HUD/greySheet.png', './assets/sprites/HUD/greySheet.xml');        
        this.load.image('weaponIconLaserPistol', './assets/sprites/player/raygun.png');
        this.load.image('weaponIconLaserRepeater', './assets/sprites/player/raygunBig.png');
        this.load.image('weaponIconPulseCharge', './assets/sprites/player/raygunPurple.png');
        this.load.image('weaponIconRocketLauncher', './assets/sprites/player/raygunPurpleBig.png');

        this.load.image('healthBarLeft', './assets/sprites/HUD/barHorizontal_red_left.png');
        this.load.image('healthBarMid', './assets/sprites/HUD/barHorizontal_red_mid.png');
        this.load.image('healthBarRight', './assets/sprites/HUD/barHorizontal_red_right.png');

        this.load.image('shieldBarLeft', './assets/sprites/HUD/barHorizontal_blue_left.png');
        this.load.image('shieldBarMid', './assets/sprites/HUD/barHorizontal_blue_mid.png');
        this.load.image('shieldBarRight', './assets/sprites/HUD/barHorizontal_blue_right.png');
    }

    public healthBarHealth = 100;
    public healthBar: HealthBar;
    public shieldBar: HealthBar;

    create(): void {

        this.hudComponent = new HUDComponent();
        this.hudComponent.playerHudIcon = this.add.sprite(this.PlayerIconX, this.HudBaseOffsetY, 'hudSprites', 'hudPlayer_blue.png');
        this.hudComponent.playerHudIcon.setScrollFactor(0);

        this.hudComponent.gem = this.add.image(this.GemIconX, this.HudBaseOffsetY, 'hudSprites', 'hudJewel_green.png');
        this.hudComponent.gem.setScale(1.0);

        this.hudComponent.gemCountText = this.add.text(this.GemIconX + this.GemTextOffsetX, this.HudBaseOffsetY + this.AmmoTextOffsetY, '0',
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.gemCountText.setOrigin(0, 0.5);
        this.hudComponent.gemCountText.setStroke('rgb(0,0,0)', 16);
        this.hudComponent.gemCountText.setFontSize(this.fontSize);

        this.hudComponent.weapon = this.add.image(this.WeaponIconX, this.HudBaseOffsetY, 'weaponIconLaserPistol');
        this.hudComponent.weapon.setScale(2.0, 2.0);
        this.hudComponent.ammoText = this.add.text(this.WeaponIconX + this.AmmoTextOffsetX, this.HudBaseOffsetY + this.AmmoTextOffsetY, '5',
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.ammoText.setStroke('rgb(0,0,0)', 16);
        this.hudComponent.ammoText.setOrigin(1, 0.5);
        this.hudComponent.ammoText.setFontSize(this.fontSize);

        this.hudComponent.infoText = this.add.text(this.InfoTextStartX, this.InfoTextStartY, 'test',
        {
            fontFamily: 'KenneyRocketSquare',
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.infoText.setOrigin(0.5, 0.5);
        this.hudComponent.infoText.setStroke('rgb(0,0,0)', 16);
        this.hudComponent.infoText.setFontSize(this.infoTextFontSize);
        this.hudComponent.infoTextExpiryGameTime = this.game.getTime();

        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('MainScene');

        //  Listen for events from it
        ourGame.events.on('playerHealthUpdated', function (playerId, health) {
            if(this.playerId == playerId) {
                this.setHealth(health);
                this.updateHealthBar(health);
            }
        }, this);

        ourGame.events.on('playerShieldUpdated', function (playerId, health) {
            if(this.playerId == playerId) {
                //this.setHealth(health);
                this.updateShieldBar(health);
            }
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

        ourGame.events.on('expiringTextEmitted', function (x, y, amount) {
            //this.emitExpiringText(x, y, amount);
        }, this);

        ourGame.events.on('weaponCollected', function (ammoCount, weaponTextureName) {
            this.setammoCount(ammoCount);
            this.setWeaponIcon(weaponTextureName);
        }, this);

        ourGame.events.on('enemyDamage', function (x, y, damage) {
            //this.emitExpiringText(x, y, damage);
        }, this);
        
        //  Listen for events from it
        ourGame.events.on('infoTextEmitted', function (text) {
            this.setInfoText(text);
        }, this);

        var maxHealth = Player.maxHealth;
        this.setHealth(maxHealth);
        
        this.healthBar = new HealthBar(this);
        this.healthBar.init(this.HealthBarStartX, this.HudBaseOffsetY - 10, maxHealth,
            200, 30, false);
        this.healthBar.setDepth(HUDComponent.depthHealthBar);

        this.healthBar.updateHealth(maxHealth);

        var maxShield = Player.maxShield;
        this.shieldBar = new HealthBar(this);
        this.shieldBar.init(this.ShieldBarStartX, this.HudBaseOffsetY, maxShield,
            200, 30, true);
        this.shieldBar.setDepth(HUDComponent.depthShieldBar);
        this.shieldBar.isVisible = true;

        this.shieldBar.updateHealth(0);

        this.scene.setVisible(false);
    }

    setPlayerId(playerId: string) {
        this.playerId = playerId;
    }

    setHealth(health: number): void {        

    }

    updateHealthBar(health: number) {
        this.healthBar.updateHealth(health);
    }
    
    updateShieldBar(shieldHealth: number) {
        this.shieldBar.updateHealth(shieldHealth);
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
        
    setWeaponIcon(textureName: string): void {
        var temp  = <Phaser.GameObjects.Sprite> this.hudComponent.weapon;
        temp.setTexture(textureName);
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

    public static get depthHealthBar(): number {return 2;}
    public static get depthShieldBar(): number {return 3;}

    healthBar: HealthBar;
   
    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;
}