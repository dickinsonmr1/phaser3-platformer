/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Player } from "../player";
 import { Constants } from "../constants";
 
 export class TitleScene extends Phaser.Scene {

    // HUD
    hudComponent: HUDComponent;

    constructor() {
        super({
            key: "TitleScene"//, active: true
        });
    }

        
    preload(): void {
        //this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
    }

    create(): void {

      
        //  Grab a reference to the Game Scene
        //let ourGame = this.scene.get('MainScene');

        /*
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
        */

        /*
       var text = this.add.text(100,100, 'Welcome to my game!');
       text.setInteractive({ useHandCursor: true });
       text.on('pointerdown', () => this.clickButton());
               
        this.scene.bringToTop;
        this.scene.start('MenuScene');
*/

    var text = this.add.text(100,100, 'Welcome to my game!');

        this.input.once('pointerdown', function (event) {

            this.scene.start('MainScene');
            this.scene.start('HudScene');

        }, this);
    }

    clickButton() {
        this.scene.switch('MainScene');
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