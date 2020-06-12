/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../phaser.d.ts"/>

 import "phaser";

 export class LoadingScene extends Phaser.Scene {

    playerIcon: Phaser.GameObjects.Image;
    loadingText: Phaser.GameObjects.Text;
    loadingTextAlpha: number;

    //infoText: Phaser.GameObjects.Text;
    //infoTextAlpha: number;
    
    constructor() {
        super({
            key: "LoadingScene"
        });
    }

        
    preload(): void {
        this.load.atlasXML('sprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');
    }

    create(): void {

        this.playerIcon = this.add.image(200, 200, 'sprites', 'hudPlayer_blue.png');
        this.playerIcon.setScale(1.0, 1.0);

        this.loadingText = this.add.text(600, 150, '// LOADING GAME',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'right',            
            color:"rgb(255,255,255)",
        });
        this.loadingText.setStroke('rgb(0,0,0)', 16);
             
        //var scene = <Phaser.Scene>this;
        
        /*
        this.infoText = this.add.text(this.game., 300, '// LOADING WORLD',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.infoText.setStroke('rgb(0,0,0)', 16);

        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('MainScene');
        

        //  Listen for events from it
        ourGame.events.on('gameLoaded', function () {            

        }, this);
        */
        this.scene.bringToTop;
    }

    update(): void {
        if(this.loadingTextAlpha > 0) {

            this.loadingTextAlpha -= 0.01;
            this.loadingText.setAlpha(this.loadingTextAlpha);
        }        
    }

    setText(text: string): void {
        this.loadingText.setText(text);
    }  
 }