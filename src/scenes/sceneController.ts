import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import { MenuBackgroundScene } from "./menuBackgroundScene";
import { PauseScene } from "./pauseScene";
import { TitleScene } from "./titleScene";
import { HudScene } from "./hudScene";
import { GameProgress } from "./gameProgress";
import { LevelCompleteScene } from "./levelCompleteScene";
import { Client } from "../socketClient"

export class SceneController extends Phaser.Scene {

    titleScene: TitleScene;
    loadingScene: LoadingScene;
    mainScene: MainScene;
    menuBackgroundScene: MenuBackgroundScene;
    pauseScene: PauseScene;
    hudScene: HudScene;
    levelCompleteScene: LevelCompleteScene;

    elapsedTimeInMs: number;

    constructor() {
        super({
            key: "SceneManager"
        })
    }

    init(data): void {
        console.log(data.id);        
    }

    preload(): void {        

         
    }

    players: string[];

    addPlayer(player) {
            
    }

    create() {
        
        const client = new Client();
    
        /*
        var pad;
        if (this.input.gamepad.total === 0)
        {
            this.input.gamepad.once('connected', pad => {

                pad = pad;
                //this.sprite = this.add.image(400, 300, 'elephant');

                //text.setText('Main Scene. Press Button 0 to change Scene');

                pad.on('down', (index, value, button) => {

                    console.log(index);
                });

            });
        }
        */

        this.titleScene = new TitleScene(this);
        this.game.scene.add("TitleScene", this.titleScene);
        
        this.menuBackgroundScene = new MenuBackgroundScene(this);
        this.game.scene.add("MenuBackgroundScene", this.menuBackgroundScene);
                
        this.loadingScene = new LoadingScene(this);
        this.game.scene.add("LoadingScene", this.loadingScene);

        this.mainScene = new MainScene(this);
        this.game.scene.add("MainScene", this.mainScene);

        this.pauseScene = new PauseScene(this);
        this.game.scene.add("PauseScene", this.pauseScene);

        this.hudScene = new HudScene(this);
        this.game.scene.add("HudScene", this.hudScene);     
        
        this.levelCompleteScene = new LevelCompleteScene(this);
        this.game.scene.add("LevelCompleteScene", this.levelCompleteScene);

        this.elapsedTimeInMs = 0;
        this.loadTitleScene();        
    }

    update(): void {

    }

    loadTitleScene() {
        this.scene.launch("TitleScene");
        this.scene.launch("MenuBackgroundScene");
    }

    preloadMainSceneAndDisplayLoadingScene(destinationName: string) {
        this.scene.stop('TitleScene');             
        
        this.scene.launch('MainScene', { id: 0, worldName: destinationName, objective: "Collect 100 gems" });
        this.scene.launch("HudScene");
        this.scene.launch('LoadingScene', { id: 0, worldName: destinationName, objective: "Collect 100 gems" });
        //this.scene.launch('HudScene');        
    }

    warpViaPortal(destinationName: string) {
        this.levelComplete();
        
        /*
        this.mainScene.fadeOutToWhite();

        this.scene.launch('LoadingScene', { id: 0, worldName: destinationName, objective: "Collect 100 gems" });
        this.scene.launch('MainScene', { id: 0, worldName: destinationName, objective: "Collect 100 gems" });
        this.scene.launch('HudScene');        
        */
    }

    levelComplete() {
        
        var gameTimeStarted = this.mainScene.gameTimeStarted;
        var gameTimePaused = this.sys.game.loop.time;

        this.elapsedTimeInMs += (gameTimePaused - gameTimeStarted);

        var gemCount = this.mainScene.player.gemsCollected;
        var score = this.mainScene.player.score;
        var enemiesKilled = this.mainScene.player.enemiesKilled;

        var totalGems = this.mainScene.world.totalGems;
        var totalEnemies = this.mainScene.world.totalEnemies;
        var worldName = this.mainScene.worldName;

        this.mainScene.fadeOutToWhite();

        //var destinationName = this.mainScene.worldName;
        //var gameProgress = new GameProgress();
        //gameProgress.save(destinationName);

        let elapsedTime = this.elapsedTimeInMs;
        this.scene.launch('LevelCompleteScene', { gemCount, totalGems, score, enemiesKilled, totalEnemies, worldName, elapsedTime });
                 
        this.mainScene.scene.transition({
            target: 'MenuBackgroundScene',
            duration: 2000,
            moveBelow: false,
            remove: true,          
        });

        this.elapsedTimeInMs = 0;
        this.scene.sleep('MainScene');
        this.scene.sleep('HudScene');
        this.scene.sleep('PauseScene');

        /*
        this.mainScene.fadeOutCamera();

        var destinationName = this.mainScene.worldName;
        var gameProgress = new GameProgress();
        gameProgress.save(destinationName);

        this.scene.stop('MainScene');
        this.scene.stop('HudScene');
        this.scene.stop('PauseScene');

        this.loadTitleScene();
        */
    }

    mainSceneLoaded() {
        this.loadingScene.mainSceneLoaded();        
        this.scene.bringToTop("LoadingScene");        
    }

    resumePreloadedMainScene() {

        this.scene.sleep("MenuBackgroundScene");
        this.scene.sleep("LoadingScene");
        
        this.scene.resume('MainScene');        
        this.scene.setVisible(true, "MainScene");

        this.scene.bringToTop("HudScene");
        this.scene.setVisible(true, "HudScene");
        this.hudScene.setInfoText("Objective: reach portal", 5000);
        
        this.mainScene.fadeInCamera();
        this.mainScene.gameTimeStarted = this.sys.game.loop.time;
        this.elapsedTimeInMs = 0;
        this.mainScene.sound.play("menuSelectSound");
    }

    pauseGame() {
        
        var gameTimeStarted = this.mainScene.gameTimeStarted;
        var gameTimePaused = this.sys.game.loop.time;

        this.elapsedTimeInMs += (gameTimePaused - gameTimeStarted);
        
        this.scene.pause('MainScene');            
        this.scene.pause('HudScene');
        this.scene.setVisible(false, "HudScene");
        this.sound.pauseAll();

        this.scene.run("PauseScene");
        this.scene.bringToTop("PauseScene")

        this.pauseScene.sound.play("pauseSound");
    }

    returnToGame() {
        this.scene.sleep('PauseScene');   

        this.mainScene.gameTimeStarted = this.sys.game.loop.time;
        this.scene.wake('MainScene');               
        this.scene.wake('HudScene');
        this.scene.setVisible(true, 'HudScene');        

        this.mainScene.sound.play("resumeSound");
    }

    returnToTitleScene() {

        var destinationName = this.mainScene.worldName;
        var gameProgress = new GameProgress();
        gameProgress.save(destinationName);

        this.scene.stop('MainScene');
        this.scene.stop('HudScene');
        this.scene.stop('PauseScene');
        this.scene.stop('LevelCompleteScene');

        this.loadTitleScene();
    }
}