/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Menu } from "./menu";
import { SceneController } from "./sceneController";
 
 export class TitleScene extends Phaser.Scene {

    sceneController: SceneController;
    menu: Menu;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;

    constructor(sceneController: SceneController) {
        super({
            key: "TitleScene"
        });

        this.sceneController = sceneController;
    }
        
    init(data): void {
        console.log(data.id);        
    }

    preload(): void {        
    }

    create(): void {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       
        this.menu = new Menu(this);

        this.menu.setTitle(this, "Alien Commando");
        this.menu.setMarker(this, ">>");
        this.menu.addMenuItem(this, "Start Game");
        this.menu.addMenuItem(this, "Continue Game");
        this.menu.addMenuItem(this, "Exit");
        this.menu.setFooter(this, "©2020 by Mark Dickinson" );
        this.menu.setFooter2(this, "Powered by Phaser 3  //  Assets by Kenney.nl" );

        this.scene.run('MenuBackgroundScene');
        this.scene.sendToBack('MenuBackgroundScene');              
    }

    resetMarker(): void {
        if(this.menu != null) {
            this.menu.refreshColorsAndMarker();
            this.menu.marker.visible = false;
        }
    }

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.selectKey))  {
            if(this.menu.selectedIndex == 0) {
                this.input.keyboard.resetKeys();
                this.sceneController.preloadGameAndDisplayLoadingScene(0);
                this.menu.refreshColorsAndMarker();
            }
            else if(this.menu.selectedIndex == 1) {
                this.input.keyboard.resetKeys();
                this.sceneController.loadLevelSelectScene();
                this.menu.refreshColorsAndMarker();
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem();
        }
    }
}