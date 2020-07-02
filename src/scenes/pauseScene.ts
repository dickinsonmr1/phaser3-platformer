/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Player } from "../gameobjects/player";
 import { Constants } from "../constants";
 import { Menu } from "./menu";
import { SceneController } from "./sceneController";
 
 export class PauseScene extends Phaser.Scene {

    sceneController: SceneController;
    // HUD
    menu: Menu;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;
    cursorLeft: Phaser.Input.Keyboard.Key;
    cursorRight: Phaser.Input.Keyboard.Key;

    constructor(sceneController: SceneController) {
        super({
            key: "PauseScene"
        });
        this.sceneController = sceneController;
    }
        
    preload(): void {

    }

    create(): void {
        
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.cursorLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.cursorRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.menu = new Menu(this);

        this.menu.setTitle(this, "Game Paused");
        this.menu.setMarker(this, ">>");
        this.menu.addMenuItem(this, "Resume");
        this.menu.addMenuComplexItem(this, "Toggle Sound", ['On', 'Off']);
        this.menu.addMenuItem(this, "Save and Exit");     
        
        this.scene.bringToTop;
    }

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.returnToGame();
        }

        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {

            if(this.menu.selectedItemIndex == 0) {
               this.returnToGame();

               //this.menu.confirmSelection(this.sound);
            }
            else if(this.menu.selectedItemIndex == 1) {
                this.menu.trySelectNextSubItem(this.sound);
            }
            else if(this.menu.selectedItemIndex == 2) {
                this.endGameAndReturnToTitleMenu();

                this.menu.confirmSelection(this.sound);
            }
        }
         
        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {
            this.menu.trySelectPreviousSubItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.menu.trySelectNextSubItem(this.sound);
        }
    }

    returnToGame(): void {        
        this.input.keyboard.resetKeys();
        this.sceneController.returnToGame();
    }   

    endGameAndReturnToTitleMenu(): void {
        this.input.keyboard.resetKeys();             
        this.sceneController.returnToTitleScene();
    }   
 }