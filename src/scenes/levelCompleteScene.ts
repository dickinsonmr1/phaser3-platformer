/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Menu } from "./menu";
import { SceneController } from "./sceneController";
 
 export class LevelCompleteScene extends Phaser.Scene {

    sceneController: SceneController;
    menu: Menu;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;

    gem: Phaser.GameObjects.Image;

    gemsCollected: number;
    totalGems: number;
    gemSummaryText: Phaser.GameObjects.Text;

    score: number;
    scoreSummaryText: Phaser.GameObjects.Text;

    enemiesKilled: number;
    totalEnemies: number;
    enemySummaryText: Phaser.GameObjects.Text;

    summaryFontSize(): number {return 40;}
    summaryStartX(): number {return this.game.canvas.width / 3;}
    summaryStartY(): number {return this.game.canvas.height / 3;}
    summaryItemDistanceY(): number {return 50;}

    constructor(sceneController: SceneController) {
        super({
            key: "LevelCompleteScene"
        });

        this.sceneController = sceneController;
    }
        
    init(data): void {
        console.log(data.id);        
        this.gemsCollected = data.gemCount;
        this.score = data.score;
        this.enemiesKilled = data.enemiesKilled;
        this.totalEnemies = data.totalEnemies;
        this.totalGems = data.totalGems;
    }

    preload(): void {    
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');            
        this.load.image('weaponIcon', './assets/sprites/player/raygunPurpleBig.png');
    }

    create(): void {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       
        this.menu = new Menu(this);

        this.menu.setTitle(this, "Level Complete");
        this.menu.setMarker(this, ">>");
        this.menu.addMenuItem(this, "Save and Continue");
        this.menu.addMenuItem(this, "Save and Exit");

        this.gem = this.add.image(this.summaryStartX() - 50, this.summaryStartY(), 'hudSprites', 'hudJewel_green.png');
        this.gem.setScale(0.5);
        this.gem.setDepth(10);

        this.gemSummaryText = this.add.text(this.summaryStartX(), this.summaryStartY(), "Gems: " + this.gemsCollected + "/" + this.totalGems,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.summaryFontSize(),
            align: 'left',            
            color:"rgb(255,255,255)",
        });
        this.gemSummaryText.setOrigin(0, 0.5);
        this.gemSummaryText.setStroke('rgb(0,0,0)', 16);

        this.enemySummaryText = this.add.text(
                                    this.summaryStartX(),
                                    this.summaryStartY() + this.summaryItemDistanceY(),
                                    "Enemies: "  + this.enemiesKilled  + "/" + this.totalEnemies,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.summaryFontSize(),
            align: 'left',            
            color:"rgb(255,255,255)",
        });
        this.enemySummaryText.setOrigin(0, 0.5);
        this.enemySummaryText.setStroke('rgb(0,0,0)', 16);

        this.scoreSummaryText = this.add.text(
                                    this.summaryStartX(),
                                    this.summaryStartY() + this.summaryItemDistanceY()  * 2,
                                    "Score: " +  + this.score,
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: this.summaryFontSize(),
            align: 'left',            
            color:"rgb(255,255,255)",
        });
        this.scoreSummaryText.setOrigin(0, 0.5);
        this.scoreSummaryText.setStroke('rgb(0,0,0)', 16);

     
        //this.menu.setFooter(this, "©2020 by Mark Dickinson" );
        //this.menu.setFooter2(this, "Powered by Phaser 3  //  Assets by Kenney.nl" );

        //this.scene.run('MenuBackgroundScene');
        //this.scene.sendToBack('MenuBackgroundScene');  
        this.scene.bringToTop();            
    }

    resetMarker(): void {
        if(this.menu != null) {
            this.menu.refreshColorsAndMarker();
            this.menu.marker.visible = false;
        }
    }

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.selectKey))  {
            if(this.menu.selectedItemIndex == 0) {
                this.input.keyboard.resetKeys();
                this.sceneController.preloadMainSceneAndDisplayLoadingScene('world-00-00');
                this.menu.refreshColorsAndMarker();
            }
            else if(this.menu.selectedItemIndex == 1) {
                this.input.keyboard.resetKeys();
                this.sceneController.returnToTitleScene();
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