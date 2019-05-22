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
        
        this.hudComponent.heart3 = this.add.sprite(400, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heart3.setScale(0.5);
        
        this.hudComponent.heart4 = this.add.sprite(450, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heart4.setScale(0.5);

        this.hudComponent.heartHalf1 = this.add.image(300, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heartHalf1.setScale(0.5);

        this.hudComponent.heartHalf2 = this.add.sprite(350, 200, 'hudSprites', 'hudHeart_full.png');
        this.hudComponent.heartHalf2.setScale(0.5);
        
        this.hudComponent.heartHalf3 = this.add.sprite(400, 200, 'hudSprites', 'hudHeart_half.png');
        this.hudComponent.heartHalf3.setScale(0.5);
        
        this.hudComponent.heartHalf4 = this.add.sprite(450, 200, 'hudSprites', 'hudHeart_empty.png');
        this.hudComponent.heartHalf4.setScale(0.5);
        
        this.scene.bringToTop;
    }

    update(): void {
   
    }

    public setHealth(health: number): void {
        switch(health) {
            case 0:
                this.hudComponent.heartHalf1.visible = true;
                this.hudComponent.heart1.visible = false;
                this.hudComponent.heartHalf2.visible = false;
                this.hudComponent.heart2.visible = false;
                this.hudComponent.heartHalf3.visible = false;
                this.hudComponent.heart3.visible = false;
                this.hudComponent.heartHalf4.visible = false;
                this.hudComponent.heart4.visible = false;
            case 1:
                this.hudComponent.heartHalf1.visible = true;
                this.hudComponent.heart1.visible = false;
                this.hudComponent.heartHalf2.visible = false;
                this.hudComponent.heart2.visible = false;
                this.hudComponent.heartHalf3.visible = false;
                this.hudComponent.heart3.visible = false;
                this.hudComponent.heartHalf4.visible = false;
                this.hudComponent.heart4.visible = false;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
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

}

