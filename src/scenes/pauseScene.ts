/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";
 import { Player } from "../player";
 import { Constants } from "../constants";
 
 export class PauseScene extends Phaser.Scene {

    // HUD
    menu: Menu;

    cursors: Phaser.Input.Keyboard.CursorKeys;     
    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "PauseScene"//, active: true
        });
    }

        
    preload(): void {
        //this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
    }

    create(): void {

        this.cursors = this.input.keyboard.createCursorKeys();        
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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

        var resumeText = this.add.text(1000, 200, 'Resume',
       {
           fontFamily: 'KenneyRocketSquare',
           fontSize: 64,
           align: 'right',            
           color:"rgb(255,255,255)",
       });
       resumeText.setStroke('rgb(0,0,0)', 16);

       var exitText = this.add.text(1000, 250, 'Exit',
       {
           fontFamily: 'KenneyRocketSquare',
           fontSize: 64,
           align: 'right',            
           color:"rgb(255,255,255)",
       });
       exitText.setStroke('rgb(0,0,0)', 16);

       this.menu = new Menu();
       this.menu.items = this.add.group();
       this.menu.items.add(resumeText);
       this.menu.items.add(exitText);
       this.menu.title = this.add.text(1000, 150, 'GAME PAUSED',
       {
           fontFamily: 'KenneyRocketSquare',
           fontSize: 64,
           align: 'right',            
           color:"rgb(255,255,255)",
       });
       this.menu.title.setStroke('rgb(0,0,0)', 16);
       this.menu.selectedIndex = 0;
    

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
        if(Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.scene.switch('MainScene');
            
            this.scene.setVisible(true, 'HudScene');
            //this.scene.resume('HudScene');            
            //this.scene.resume('MainScene');   
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.menu.selectedIndex++;
        }

    }

    setHealth(health: number): void {        
      
    }
   
 }

 export class Menu {
    title: Phaser.GameObjects.Text;
    items: Phaser.GameObjects.Group;
    selectedIndex: integer;

    selectNextItem() {
        if(this.selectedIndex < this.items.getLength())
            this.selectedIndex++;        

        //this.items. ().findIndex(this.selectedIndex);
    }

    selectPreviousItem() {
        if(this.selectedIndex > 0)
            this.selectedIndex--;        
    }
 }

 export class MenuItem {
    exitText: Phaser.GameObjects.Text;
 }