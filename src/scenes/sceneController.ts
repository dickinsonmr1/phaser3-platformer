import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import { MenuBackgroundScene } from "./menuBackgroundScene";
import { PauseScene } from "./pauseScene";
import { TitleScene } from "./titleScene";
import { HudScene } from "./hudScene";
import { GameProgress } from "./gameProgress";
import { LevelCompleteScene } from "./levelCompleteScene";

export class SceneController extends Phaser.Scene {

    titleScene: TitleScene;
    loadingScene: LoadingScene;
    mainScene: MainScene;
    menuBackgroundScene: MenuBackgroundScene;
    pauseScene: PauseScene;
    hudScene: HudScene;
    levelCompleteScene: LevelCompleteScene;

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

    create() {

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

        var gemCount = this.mainScene.player.gemsCollected;
        var score = this.mainScene.player.score;
        var enemiesKilled = this.mainScene.player.enemiesKilled;

        var totalGems = this.mainScene.world.totalGems;
        var totalEnemies = this.mainScene.world.totalEnemies;

        this.mainScene.fadeOutToWhite();

        //var destinationName = this.mainScene.worldName;
        //var gameProgress = new GameProgress();
        //gameProgress.save(destinationName);

        
        this.scene.launch('LevelCompleteScene', { gemCount, totalGems, score, enemiesKilled, totalEnemies });
                 
        this.mainScene.scene.transition({
            target: 'MenuBackgroundScene',
            duration: 2000,
            moveBelow: false,
            remove: true,          
        });

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
        
        this.scene.bringToTop("HudScene");
        this.scene.setVisible(true, "HudScene");
        this.hudScene.setInfoText("Objective: reach portal", 5000);
        
        this.scene.resume('MainScene');        
        this.scene.setVisible(true, "MainScene");
        this.mainScene.fadeInCamera();
    }

    pauseGame() {
        this.scene.pause('MainScene');            
        this.scene.pause('HudScene');
        this.scene.setVisible(false, "HudScene");
        this.sound.pauseAll();

        this.scene.run("PauseScene");
        this.scene.bringToTop("PauseScene")
    }

    returnToGame() {
        this.scene.sleep('PauseScene');   
        this.scene.wake('MainScene');               
        this.scene.setVisible(true, 'HudScene');
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