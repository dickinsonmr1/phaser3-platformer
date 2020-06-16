import { LoadingScene } from "./loadingScene";
import { MainScene } from "./mainScene";
import { MenuBackgroundScene } from "./menuBackgroundScene";
import { PauseScene } from "./pauseScene";
import { TitleScene } from "./titleScene";
import { LevelSelectScene } from "./levelSelectScene";

export class SceneController extends Phaser.Scene {

    titleScene: TitleScene;
    levelSelectScene: LevelSelectScene;
    loadingScene: LoadingScene;
    mainScene: MainScene;
    menuBackgroundScene: MenuBackgroundScene;
    pauseScene: PauseScene;

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
        this.scene.start("TitleScene");
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