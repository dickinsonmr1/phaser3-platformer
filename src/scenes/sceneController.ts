import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import { MenuBackgroundScene } from "./menuBackgroundScene";
import { PauseScene } from "./pauseScene";
import { TitleScene } from "./titleScene";
import { LevelSelectScene } from "./levelSelectScene";
import { HudScene } from "./hudScene";
import { GameProgress } from "./gameProgress";
import { LevelCompleteScene } from "./levelCompleteScene";

export class SceneController extends Phaser.Scene {

    titleScene: TitleScene;
    levelSelectScene: LevelSelectScene;
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
                
        this.levelSelectScene = new LevelSelectScene(this);
        this.game.scene.add("LevelSelectScene", this.levelSelectScene);

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
        this.scene.launch("LevelSelectScene");
        this.scene.launch("MenuBackgroundScene");
        
        this.scene.sleep("LevelSelectScene");
    }

    returnToTitleSceneFromLevelSelect() {
        this.scene.sleep('LevelSelectScene');
        this.scene.launch('TitleScene');        
        this.titleScene.resetMarker();
    }

    preloadMainSceneAndDisplayLoadingScene(destinationName: string) {
        this.scene.stop('TitleScene');        
        this.scene.stop('LevelSelectScene');         

        this.scene.launch("HudScene");
        this.scene.launch('MainScene', { id: 0, worldName: destinationName, objective: "Collect 100 gems" });
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

        this.mainScene.fadeOutToWhite();

        this.scene.launch('LevelCompleteScene');
        this.scene.launch('MenuBackgroundScene');


        this.scene.stop('MainScene');
        this.scene.stop('HudScene');
        this.scene.stop('PauseScene');

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

    loadLevelSelectScene() {
        this.scene.sleep('TitleScene');                
        this.scene.resume('LevelSelectScene');
        this.levelSelectScene.resetMarker();
        //this.levelSelectScene.menu.refreshColorsAndMarker();
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

        this.mainScene.fadeOutCamera();

        var destinationName = this.mainScene.worldName;
        var gameProgress = new GameProgress();
        gameProgress.save(destinationName);

        this.scene.stop('MainScene');
        this.scene.stop('HudScene');
        this.scene.stop('PauseScene');

        this.loadTitleScene();
    }
}