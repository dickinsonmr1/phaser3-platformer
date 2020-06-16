/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Menu } from "./menu";
 
 export class TitleScene extends Phaser.Scene {

    menu: Menu;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;

    private skySprite: Phaser.GameObjects.TileSprite;
    skySpriteX: number;
    
    private spaceship: Phaser.GameObjects.Sprite;
    private spaceshipMoveTime: number;

    constructor() {
        super({
            key: "TitleScene"
        });
    }
        
    init(data): void {
        console.log(data.id);
        if(data.skySpriteX != null)
            this.skySpriteX = data.skySpriteX;
        else {
            this.skySpriteX = 0;
        }
    }

    preload(): void {
        this.load.image('menuSky', './assets/sprites/backgrounds/backgroundEmpty.png');

        this.load.atlasXML('alienShipSprites', './assets/sprites/ships/spritesheet_spaceships.png', './assets/sprites/ships/spritesheet_spaceships.xml');
    }

    create(): void {

        this.spaceshipMoveTime = 0;

        this.skySprite = this.add.tileSprite(0, 0, 20480, 1080, 'menuSky');
        this.skySprite.setX(this.skySpriteX);
        this.skySprite.setY(540);

        this.spaceship = this.add.sprite(1600, 650, 'alienShipSprites', 'shipBlue_manned.png');

        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       
        this.menu = new Menu(this);

        this.menu.setTitle(this, "Zenith Commando");
        this.menu.setMarker(this, ">>");
        this.menu.addMenuItem(this, "Start Game");
        this.menu.addMenuItem(this, "Continue Game");
        this.menu.addMenuItem(this, "Exit");
        this.menu.setFooter(this, "©2020 by Mark Dickinson" );
        this.menu.setFooter2(this, "Powered by Phaser 3  //  Assets by Kenney.nl" );
    }

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.selectKey))  {
            if(this.menu.selectedIndex == 0) {
                this.input.keyboard.resetKeys();
                this.scene.sleep('TitleScene');                
                this.scene.start('MainScene', { id: 0, worldName: 'world-04-02' });
                this.scene.start('HudScene');
                this.scene.start('LoadingScene');
            }
            else if(this.menu.selectedIndex == 1) {
                this.input.keyboard.resetKeys();
                this.scene.sleep('TitleScene');
                this.scene.start('LevelSelectScene', { skySpriteX: 0 });
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem();
        }

        this.skySprite.x -= 10;
        if(this.skySprite.x  * (-1) > this.skySprite.width * .4)
            this.skySprite.x = 0;

        this.spaceshipMoveTime++;

        if(this.spaceshipMoveTime < 150)
            this.spaceship.y -= 1;
        if(this.spaceshipMoveTime > 150)
            this.spaceship.y += 1;

        if(this.spaceshipMoveTime > 300)
            this.spaceshipMoveTime = 0;        
    }
}