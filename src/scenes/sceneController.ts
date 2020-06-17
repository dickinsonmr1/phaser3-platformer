import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import { MenuBackgroundScene } from "./menuBackgroundScene";
import { PauseScene } from "./pauseScene";
import { TitleScene } from "./titleScene";
import { LevelSelectScene } from "./levelSelectScene";
import { HudScene } from "./hudScene";

export class SceneController extends Phaser.Scene {

    titleScene: TitleScene;
    levelSelectScene: LevelSelectScene;
    loadingScene: LoadingScene;
    mainScene: MainScene;
    menuBackgroundScene: MenuBackgroundScene;
    pauseScene: PauseScene;
    hudScene: HudScene;

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

        this.scene.launch("TitleScene");
        //this.scene.launch("LevelSelectScene");
        this.scene.launch("MenuBackgroundScene");
    }

    update(): void {

    }

    loadTitleScene() {

    }

    loadLoadingScene() {

    }

    loadMainScene() {

    }

    pauseGame() {

    }

    returnToGame() {

    }

    returnToTitleScene() {

    }
}