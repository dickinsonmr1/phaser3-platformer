/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { SceneController } from "./sceneController";

 export class LoadingScene extends Phaser.Scene {

    sceneController: SceneController;

    selectKey: Phaser.Input.Keyboard.Key;

    playerIcon: Phaser.GameObjects.Image;

    titleText: Phaser.GameObjects.Text;
    loadingText: Phaser.GameObjects.Text;
    loadingTextAlpha: number;

    gameLoaded: boolean;

    private get titleStartX(): number { return this.game.canvas.width / 2; }

    //infoText: Phaser.GameObjects.Text;
    //infoTextAlpha: number;
    
    constructor(sceneController: SceneController) {
        super({
            key: "LoadingScene"
        });

        this.sceneController = sceneController;
    }

        
    preload(): void {
        this.load.atlasXML('sprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');
    }

    create(): void {

        this.loadingTextAlpha = 0;
        this.gameLoaded = false;
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.playerIcon = this.add.image(200, 200, 'sprites', 'hudPlayer_blue.png');
        this.playerIcon.setScale(1.0, 1.0);

        this.titleText = this.add.text(this.titleStartX, 150, 'WORLD 04-02',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 96,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.titleText.setStroke('rgb(0,0,0)', 16);   
        this.titleText.setAlpha(1);//this.loadingTextAlpha);        
        this.titleText.setOrigin(0.5, 0);
        //var scene = <Phaser.Scene>this;
                
        this.loadingText = this.add.text(this.titleStartX, 800, 'LOADING WORLD...',
        {
            fontFamily: 'KenneyRocketSquare',
            fontSize: 64,
            align: 'center',            
            color:"rgb(255,255,255)",
        });
        this.loadingText.setStroke('rgb(0,0,0)', 16);
        this.loadingText.setOrigin(0.5, 0);

        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('MainScene');
    
        //  Listen for events from it
        ourGame.events.on('gameLoaded', function () {            

            this.loadingText.setText('PRESS ENTER TO CONTINUE');               
            this.gameLoaded = true;

        }, this);
        
        this.scene.bringToTop;
    }

    update(): void {


        //if(this.titleText.x > 600)
            //this.titleText.x -= 50;

        if(Phaser.Input.Keyboard.JustDown(this.selectKey) && this.gameLoaded)  {
            this.sceneController.loadMainScene();
        }

        if(this.loadingTextAlpha < 1) {

            this.loadingTextAlpha += 0.05;
            this.loadingText.setAlpha(this.loadingTextAlpha);
        }        
    }

    setText(text: string): void {
        this.loadingText.setText(text);
    }  
 }