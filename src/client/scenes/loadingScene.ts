/**
 * @author       Mark Dickinson
 * @copyright    2020 Mark Dickinson
 * @license      none
 */

 /// <reference path="../../../node_modules/phaser/types/phaser.d.ts"/>

 import "phaser";
 import { SceneController } from "./sceneController";

 export class LoadingScene extends Phaser.Scene {

    sceneController: SceneController;

    selectKey: Phaser.Input.Keyboard.Key;

    playerIcon: Phaser.GameObjects.Image;

    titleText: Phaser.GameObjects.Text;

    objectiveText: Phaser.GameObjects.Text;

    loadingText: Phaser.GameObjects.Text;
    loadingTextAlpha: number;

    gameLoaded: boolean;
    gameLoadedTime: number;

    worldName: string;
    objective: string;

    private get titleFontSize(): number { return 72; }
    private get objectiveTextFontSize(): number { return 48; }
    private get loadingTextFontSize(): number { return 48; }

    private get titleStartX(): number { return this.game.canvas.width / 2; }
    private get titleStartY(): number { return this.game.canvas.height / 4; }
    subtitleOffsetY(): number {return 150;}
    
    //infoText: Phaser.GameObjects.Text;
    //infoTextAlpha: number;
    
    constructor(sceneController: SceneController) {
        super({
            key: "LoadingScene"
        });

        this.sceneController = sceneController;
    }

    init(data): void {
        this.worldName = data.worldName;
        this.objective = data.objective;
        console.log(data.worldName);        
    }
        
    preload(): void {
        this.load.atlasXML('sprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');
    }

    restart(): void {
        this.scene.restart();
    }

    create(): void {

        this.input.keyboard.resetKeys();

        this.loadingTextAlpha = 0;
        //this.cameras.main.setBackgroundColor("#FFFFFF");
        this.gameLoaded = false;
        this.gameLoadedTime = 0;
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //this.playerIcon = this.add.image(200, 200, 'sprites', 'hudPlayer_blue.png');
        //this.playerIcon.setScale(1.0, 1.0);

        if(this.titleText == undefined) {
            this.titleText = this.add.text(this.titleStartX, this.titleStartY, this.worldName,
            {
                fontFamily: 'KenneyRocketSquare', 
                align: 'center',            
                color:"rgb(255,255,255)",
            });
            this.titleText.setStroke('rgb(0,0,0)', 16);   
            this.titleText.setAlpha(1);//this.loadingTextAlpha);        
            this.titleText.setOrigin(0.5, 0.5);
            this.titleText.setFontSize(this.titleFontSize);
        }
        this.titleText.text = this.worldName;
        //var scene = <Phaser.Scene>this;
             
        if(this.objectiveText == undefined) {
            this.objectiveText = this.add.text(this.titleStartX, this.titleStartY + this.subtitleOffsetY(), 'Objective: ' + this.objective,
            {
                fontFamily: 'KenneyRocketSquare',
                align: 'center',            
                color:"rgb(255,255,255)",
            });
            this.objectiveText.setStroke('rgb(0,0,0)', 16);
            this.objectiveText.setOrigin(0.5, 0.5);
            this.objectiveText.setFontSize(this.objectiveTextFontSize);
        }
        this.objectiveText.text = 'Objective: ' + this.objective;

        if(this.loadingText == undefined) {
            this.loadingText = this.add.text(this.titleStartX, 800, 'LOADING WORLD...',
            {
                fontFamily: 'KenneyRocketSquare',
                align: 'center',            
                color:"rgb(255,255,255)",
            });
            this.loadingText.setStroke('rgb(0,0,0)', 16);
            this.loadingText.setOrigin(0.5, 0.5);
            this.loadingText.setFontSize(this.loadingTextFontSize);
        }
        this.loadingText.setScale(1);

        this.scene.bringToTop;        
    }

    mainSceneLoaded() : void{
        this.loadingText.setText('PRESS ENTER TO CONTINUE');               
        this.gameLoaded = true;
        this.gameLoadedTime = 60;
    }

    update(): void {


        //if(this.titleText.x > 600)
            //this.titleText.x -= 50;

        if(Phaser.Input.Keyboard.JustDown(this.selectKey) && this.gameLoaded)  {
            this.sceneController.resumePreloadedMainScene();
        }

        if(this.loadingTextAlpha < 1) {

            this.loadingTextAlpha += 0.2;
            this.loadingText.setAlpha(this.loadingTextAlpha);
        }        

        if(this.gameLoaded) {
            if(this.gameLoadedTime > 30)
                this.loadingText.scale += 0.005;
            else if(this.gameLoadedTime < 30 && this.gameLoadedTime > 0)
                this.loadingText.scale -= 0.005;
            else if(this.gameLoadedTime == 0)
                this.gameLoadedTime = 60;

            this.gameLoadedTime--;
        }
    }

    setText(text: string): void {
        this.loadingText.setText(text);
    }  
 }