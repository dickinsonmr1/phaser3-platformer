/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Menu } from "./menu";
 import { SceneController } from "./sceneController";
 
 export class LevelSelectScene extends Phaser.Scene {

    sceneController: SceneController;
    menu: Menu;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;

    constructor(sceneController: SceneController) {
        super({
            key: "LevelSelectScene"
        });
        this.sceneController = sceneController;
    }

    init(data): void {
        console.log(data.id);
    }
        
    preload(): void {
        this.load.image('menuSky', './assets/sprites/backgrounds/backgroundEmpty.png');
    }

    create(): void {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       
        this.menu = new Menu(this);

        this.menu.setTitle(this, "Level Select");
        this.menu.setMarker(this, ">>");
        this.menu.addMenuItem(this, "World 01-01");
        this.menu.addMenuItem(this, "World 02-01");
        this.menu.addMenuItem(this, "Exit to Title");        
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
            if(this.menu.selectedIndex == 1) {
                this.input.keyboard.resetKeys();

                this.sceneController.preloadGameAndDisplayLoadingScene(1);
                this.menu.refreshColorsAndMarker();   
            }
            else if(this.menu.selectedIndex == 2) {
                this.input.keyboard.resetKeys();
                this.sceneController.returnToTitleSceneFromLevelSelect();
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