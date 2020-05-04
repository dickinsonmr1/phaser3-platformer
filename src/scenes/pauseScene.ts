/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Player } from "../player";
 import { Constants } from "../constants";
 import { Menu } from "./menu";
 
 export class PauseScene extends Phaser.Scene {

    // HUD
    menu: Menu;

    //cursors: Phaser.Input.Keyboard.CursorKeys;     
    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "PauseScene"
        });
    }
        
    preload(): void {

    }

    create(): void {
        
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       
       this.menu = new Menu(this);

       this.menu.setTitle(this, "Game Paused");
       this.menu.setMarker(this, ">>");
       this.menu.addMenuItem(this, "Resume");
       this.menu.addMenuItem(this, "Toggle Sound - On");
       this.menu.addMenuItem(this, "Exit");

       this.input.once('pointerdown', function (event) {
            this.scene.switch('MainScene');            
            this.scene.setVisible(true, 'HudScene');
            //this.scene.resume('HudScene');            
            //this.scene.resume('MainScene');    

        }, this);
        
    }

    /*
    clickButton() {
        this.scene.switch('MainScene');
    }
    */

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.pauseKey)
        || (Phaser.Input.Keyboard.JustDown(this.selectKey) && this.menu.selectedIndex == 0) ) {
            this.scene.switch('MainScene');
            
            this.scene.setVisible(true, 'HudScene');
            //this.scene.resume('HudScene');            
            //this.scene.resume('MainScene');   
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem();
        }

    }

    setHealth(health: number): void {        
      
    }   
 }

 export class MenuItem {
    item: Phaser.GameObjects.Text;
 }