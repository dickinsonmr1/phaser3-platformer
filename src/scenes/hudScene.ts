/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Player } from "../player";
 import { Constants } from "../constants";
import { HealthBar } from "./healthBar";
 
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

        this.load.image('healthBarLeft', './assets/sprites/HUD/barHorizontal_red_left.png');
        this.load.image('healthBarMid', './assets/sprites/HUD/barHorizontal_red_mid.png');
        this.load.image('healthBarRight', './assets/sprites/HUD/barHorizontal_red_right.png');
    }

    private static get healthBarOriginX(): number {return 600;}  
    private static get healthBarOriginY(): number {return 900;}  
    private static get healthBarLeftSegmentWidth(): number {return 6;}  
    private static get healthBarMidSegmentWidth(): number {return 200;}  
    private static get healthBarRightSegmentWidth(): number {return 6;}  
    private static get healthBarHeight(): number {return 30;} 

    private static get healthBarShadowBuffer(): number {return 4;}
    private static get healthBarShadowOffsetX(): number {return -2;}  
    private static get healthBarShadowOffsetY(): number {return -2;}  
    private static get healthBarShadowHeight(): number {return HudScene.healthBarHeight + HudScene.healthBarShadowBuffer;} 
    private static get healthBarShadowLeftSegmentWidth(): number {return HudScene.healthBarLeftSegmentWidth;}  
    private static get healthBarShadowMidSegmentWidth(): number {return HudScene.healthBarMidSegmentWidth + HudScene.healthBarShadowBuffer;}  
    private static get healthBarShadowRightSegmentWidth(): number {return HudScene.healthBarRightSegmentWidth;}  

    public healthBarHealth = 100;
    public healthBar: HealthBar;

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

        /*
        this.hudComponent.healthBarShadowLeft = this.add.image(
            HudScene.healthBarOriginX + HudScene.healthBarShadowOffsetX,
            HudScene.healthBarOriginY + HudScene.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_left.png');
        this.hudComponent.healthBarShadowLeft.setOrigin(0,0);
        this.hudComponent.healthBarShadowLeft.setDisplayOrigin(0,0);
        this.hudComponent.healthBarShadowLeft.setDisplaySize(HudScene.healthBarShadowLeftSegmentWidth, HudScene.healthBarShadowHeight);
        this.hudComponent.healthBarShadowLeft.alpha = 0.4;    
        
        this.hudComponent.healthBarShadowMid = this.add.image(
            HudScene.healthBarOriginX + HudScene.healthBarShadowOffsetX + HudScene.healthBarShadowLeftSegmentWidth,
            HudScene.healthBarOriginY + HudScene.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_mid.png');
        //this.hudComponent.healthBarShadowMid = this.add.image(601, 195, 'uiSpaceSprites', 'glassPanel.png');
        //this.hudComponent.healthBarShadowMid = this.add.image(604, 195, 'greyUISprites', 'grey_button05.png');
        //this.hudComponent.healthBarShadowMid = this.add.image(604, 195, 'redUISprites', 'red_button10.png');
        this.hudComponent.healthBarShadowMid.setOrigin(0, 0);
        this.hudComponent.healthBarShadowMid.setDisplayOrigin(0,0);// = 0;
        this.hudComponent.healthBarShadowMid.setDisplaySize(HudScene.healthBarShadowMidSegmentWidth, HudScene.healthBarShadowHeight);
        this.hudComponent.healthBarShadowMid.alpha = 0.4;    
        
        this.hudComponent.healthBarShadowRight = this.add.image(
            HudScene.healthBarOriginX + HudScene.healthBarShadowOffsetX + HudScene.healthBarShadowLeftSegmentWidth + HudScene.healthBarShadowMidSegmentWidth,
            HudScene.healthBarOriginY + HudScene.healthBarShadowOffsetY,
            'uiSpaceSprites', 'barHorizontal_shadow_right.png');
        this.hudComponent.healthBarShadowRight.setOrigin(0,0);
        this.hudComponent.healthBarShadowRight.setDisplayOrigin(0,0);
        this.hudComponent.healthBarShadowRight.setDisplaySize(HudScene.healthBarShadowRightSegmentWidth, HudScene.healthBarShadowHeight);
        this.hudComponent.healthBarShadowRight.alpha = 0.4;    
        
        this.hudComponent.healthBarLeft = this.add.image(HudScene.healthBarOriginX, HudScene.healthBarOriginY, 'healthBarLeft');//'uiSpaceSprites', 'barHorizontal_red_left.png');
        this.hudComponent.healthBarLeft.setOrigin(0,0);
        this.hudComponent.healthBarLeft.setDisplayOrigin(0,0);
        this.hudComponent.healthBarLeft.setDisplaySize(HudScene.healthBarLeftSegmentWidth, HudScene.healthBarHeight);

        this.hudComponent.healthBarMid = this.add.image(
            HudScene.healthBarOriginX + HudScene.healthBarLeftSegmentWidth,
            HudScene.healthBarOriginY, 'healthBarMid');//'uiSpaceSprites', 'barHorizontal_red_mid.png');
        //this.hudComponent.healthBarMid = this.add.image(609, 200, 'redUISprites', 'red_panel.png');
        this.hudComponent.healthBarMid.setOrigin(0,0);
        this.hudComponent.healthBarMid.setDisplayOrigin(0,0);
        this.hudComponent.healthBarMid.setDisplaySize(HudScene.healthBarMidSegmentWidth, HudScene.healthBarHeight);

        this.hudComponent.healthBarRight = this.add.image(
            HudScene.healthBarOriginX + HudScene.healthBarLeftSegmentWidth + HudScene.healthBarMidSegmentWidth,
            HudScene.healthBarOriginY, 'healthBarRight');//'uiSpaceSprites', 'barHorizontal_red_right.png');
            this.hudComponent.healthBarRight.setOrigin(0,0);
            this.hudComponent.healthBarRight.setDisplayOrigin(0,0);
            this.hudComponent.healthBarRight.setDisplaySize(HudScene.healthBarRightSegmentWidth, HudScene.healthBarHeight);
        */
        /*
        var graphics = this.add.graphics({ fillStyle:{ color: 0xff0000, alpha: 0.8 },  });

        var rect = new Phaser.Geom.Rectangle(900, 200, 200, 40);;

        var graphics2 = this.add.graphics({ lineStyle: { color: 0xffffff, width: 2} });

        var rect2 = new Phaser.Geom.Rectangle(895, 195, 210, 50);;
        graphics.fillRectShape(rect);
        graphics2.strokeRectShape(rect2);
        //this.hudComponent.healthBarRight = this.add.image(694, 200, 'uiSpaceSprites', 'barHorizontal_red_right.png');
        */

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
        this.healthBar.init(600, 900, maxHealth,
            200, 30);

        this.healthBar.updateHealth(maxHealth);

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

    updateHealthBar(health: number) {
        this.healthBar.updateHealth(health);

        /*
        if(health <= 0) {
            this.healthBar.healthBarLeft.visible = false;
            this.healthBar.healthBarMid.visible = false;
            this.healthBar.healthBarRight.visible = false;
        }
        else {

            this.healthBar.healthBarLeft.visible = true;
            this.healthBar.healthBarMid.visible = true;
            this.healthBar.healthBarRight.visible = true;

            this.healthBar.healthBarMid.setX(this.healthBar.healthBarLeft.x + HudScene.healthBarLeftSegmentWidth);
            this.healthBar.healthBarMid.setDisplaySize(health, HudScene.healthBarHeight);    
            this.healthBar.healthBarRight.setX(this.healthBar.healthBarMid.x + this.healthBar.healthBarMid.displayWidth);    
        }
        */
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

    healthBar: HealthBar;

    /*
    healthBarShadowLeft: Phaser.GameObjects.Image;
    healthBarShadowMid: Phaser.GameObjects.Image;
    healthBarShadowRight: Phaser.GameObjects.Image;

    healthBarLeft: Phaser.GameObjects.Image;
    healthBarMid: Phaser.GameObjects.Image;
    healthBarRight: Phaser.GameObjects.Image;
    */
   
    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
}