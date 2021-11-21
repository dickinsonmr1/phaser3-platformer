/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

 import "phaser";
 import { Player } from "../../gameobjects/player";
 import { Constants } from "../constants";
 import { Menu, IconValueMapping } from "./menu";
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

    restart(): void {
        this.scene.restart();
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

        // TODO: temporary fix
        var temp = new Array<IconValueMapping>();
        temp.push(new IconValueMapping({description: 'On', texture: 'sprites', frame: 'hudPlayer_blue.png', scale: 1}));
        temp.push(new IconValueMapping({description: 'Off', texture: 'sprites', frame: 'hudPlayer_pink.png', scale: 1}));
        this.menu.addMenuComplexItemWithIcons(this, "Toggle Sound", temp);
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

                this.sound.play("backSound");
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