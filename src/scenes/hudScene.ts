/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Player } from "../player";
 import { Constants } from "../constants";
 
 export class HudScene extends Phaser.Scene {

    // HUD
    hudComponent: HUDComponent;

    constructor() {
        super({
            key: "HudScene"
        });
    }

        
    preload(): void {
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
        this.load.atlasXML('uiSpaceSprites', './assets/sprites/HUD/uipackSpace_sheet.png', './assets/sprites/HUD/uipackSpace_sheet.xml');        
        this.load.atlasXML('redUISprites', './assets/sprites/HUD/redSheet.png', './assets/sprites/HUD/redSheet.xml');        
        this.load.atlasXML('greyUISprites', './assets/sprites/HUD/greySheet.png', './assets/sprites/HUD/greySheet.xml');        
        this.load.image('weaponIcon', './assets/sprites/player/raygunPurpleBig.png');
    }

    create(): void {

        this.hudComponent = new HUDComponent();
        this.hudComponent.playerHudIcon = this.add.sprite(200, 200, 'hudSprites', 'hudPlayer_blue.png');
        this.hudComponent.playerHudIcon.setScrollFactor(0);

        this.hudComponent.heart1 = this.add.image(300, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart1.setScale(0.5);

        this.hudComponent.heart2 = this.add.sprite(350, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart2.setScale(0.5);
        
        this.hudComponent.heart3 = this.add.sprite(400, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart3.setScale(0.5);
        
        this.hudComponent.heart4 = this.add.sprite(450, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heart4.setScale(0.5);

        this.hudComponent.heartHalf1 = this.add.image(300, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf1.setScale(0.5);

        this.hudComponent.heartHalf2 = this.add.sprite(350, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf2.setScale(0.5);
        
        this.hudComponent.heartHalf3 = this.add.sprite(400, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf3.setScale(0.5);
        
        this.hudComponent.heartHalf4 = this.add.sprite(450, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf4.setScale(0.5);
               
        this.hudComponent.heartEmpty1 = this.add.image(300, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty1.setScale(0.5);

        this.hudComponent.heartEmpty2 = this.add.image(350, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty2.setScale(0.5);

        this.hudComponent.heartEmpty3 = this.add.image(400, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty3.setScale(0.5);

        this.hudComponent.heartEmpty4 = this.add.image(450, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartEmpty4.setScale(0.5);

        this.hudComponent.gem = this.add.image(800, 200, 'hudSprites', 'hudJewel_green.png');
        this.hudComponent.gem.setScale(1.0);

        this.hudComponent.gemCountText = this.add.text(900, 150, '0',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.gemCountText.setStroke('rgb(0,0,0)', 16);

        this.hudComponent.weapon = this.add.image(1720, 200, 'weaponIcon');
        this.hudComponent.weapon.setScale(2.0, 2.0);
        this.hudComponent.ammoText = this.add.text(1500, 150, '5',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.ammoText.setStroke('rgb(0,0,0)', 16);

        //this.hudComponent.healthBarShadowLeft = this.add.image(600, 200, 'uiSpaceSprites', 'barHorizontal_shadow_left.png');
        //this.hudComponent.healthBarShadowLeft.originX = 0;
        //this.hudComponent.healthBarShadowLeft.displayWidth = 6;  

        //this.hudComponent.healthBarShadowMid = this.add.image(604, 195, 'uiSpaceSprites', 'glassPanel.png');
        this.hudComponent.healthBarShadowMid = this.add.image(604, 195, 'greyUISprites', 'grey_button05.png');
        //this.hudComponent.healthBarShadowMid = this.add.image(604, 195, 'redUISprites', 'red_button10.png');
        this.hudComponent.healthBarShadowMid.originX = 0;
        this.hudComponent.healthBarShadowMid.originY = 0;
        this.hudComponent.healthBarShadowMid.displayOriginX = 0;
        this.hudComponent.healthBarShadowMid.displayOriginY = 0;
        this.hudComponent.healthBarShadowMid.displayWidth = 210;        
        this.hudComponent.healthBarShadowMid.displayHeight = 50;    
        this.hudComponent.healthBarShadowMid.alpha = 0.4;    
        
        //this.hudComponent.healthBarShadowRight = this.add.image(694, 200, 'uiSpaceSprites', 'barHorizontal_shadow_right.png');
        //this.hudComponent.healthBarShadowRight.originX = 0;
        //this.hudComponent.healthBarShadowRight.displayWidth = 6;  

        //this.hudComponent.healthBarLeft = this.add.image(600, 200, 'uiSpaceSprites', 'barHorizontal_red_left.png');
        this.hudComponent.healthBarMid = this.add.image(609, 200, 'redUISprites', 'red_panel.png');
        this.hudComponent.healthBarMid.originX = 0;
        this.hudComponent.healthBarMid.originY = 0;
        this.hudComponent.healthBarMid.displayOriginX = 0;
        this.hudComponent.healthBarMid.displayOriginY = 0;
        this.hudComponent.healthBarMid.displayWidth = 200;
        this.hudComponent.healthBarMid.displayHeight = 40;
        //this.hudComponent.healthBarRight = this.add.image(694, 200, 'uiSpaceSprites', 'barHorizontal_red_right.png');

        this.hudComponent.infoText = this.add.text(300, 300, 'test',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.infoText.setStroke('rgb(0,0,0)', 16);

        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('MainScene');

        //  Listen for events from it
        ourGame.events.on('playerHealthUpdated', function (health) {
            this.setHealth(health);
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

        this.setHealth(8);
        
        //this.scene.bringToTop;
        this.scene.setVisible(false);
    }

    update(): void {
        if(this.hudComponent.infoTextAlpha > 0) {

            this.hudComponent.infoTextAlpha -= 0.01;
            this.hudComponent.infoText.setAlpha(this.hudComponent.infoTextAlpha);
        }        
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

    setGemCount(gemCount: number): void {
        this.hudComponent.gemCountText.setText(gemCount.toString());
        //this.hudComponent.gemCountOutlineText.setText(gemCount.toString());
    }

    
    setammoCount(ammo: number): void {
        this.hudComponent.ammoText.setText(ammo.toString());
        if(ammo <= 0)
            this.hudComponent.ammoText.setColor("rgb(255,50,50)")
        else
            this.hudComponent.ammoText.setColor("rgb(255,255,255)")
        //this.hudComponent.gemCountOutlineText.setText(gemCount.toString());
    }

    setText(text: string): void {
        this.hudComponent.infoText.setText(text);
    }

    displayExpiringInfoText(): void {
        this.hudComponent.infoTextAlpha = 1;
        this.hudComponent.infoText.setAlpha(this.hudComponent.infoTextAlpha);
    }

    setInfoText(text: string): void {
        this.hudComponent.infoText.setText(text);
        this.hudComponent.infoTextAlpha = 1;

        this.hudComponent.infoText.setAlpha(this.hudComponent.infoTextAlpha);
        //this.hudComponent.gemCountOutlineText.setText(gemCount.toString());
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

    healthBarShadowLeft: Phaser.GameObjects.Image;
    healthBarShadowMid: Phaser.GameObjects.Image;
    healthBarShadowRight: Phaser.GameObjects.Image;

    healthBarLeft: Phaser.GameObjects.Image;
    healthBarMid: Phaser.GameObjects.Image;
    healthBarRight: Phaser.GameObjects.Image;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
}