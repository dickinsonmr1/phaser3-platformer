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
            key: "HudScene", active: true
        });
    }

        
    preload(): void {
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
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

        this.hudComponent.gem = this.add.image(1720, 200, 'hudSprites', 'hudJewel_green.png');
        this.hudComponent.gem.setScale(1.0);

        this.hudComponent.gemCountText = this.add.text(1500, 150, '0',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.hudComponent.gemCountText.setStroke('rgb(0,0,0)', 16);

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

        ourGame.events.on('enemyDamage', function (x, y, damage) {
            this.emitExpiringText(x, y, damage);
        }, this);
        

        this.setHealth(8);
        
        this.scene.bringToTop;
    }

    update(): void {
        
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
}