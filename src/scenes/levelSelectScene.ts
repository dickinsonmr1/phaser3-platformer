/**
 * @author       Mark Dickinson
 * @copyright    2019 Mark Dickinson
 * @license      none
 */

 /// <reference path="../dts/phaser.d.ts"/>

 import "phaser";
 import { Menu } from "./menu";
 import { SceneController } from "./sceneController";
 import { GameProgress, SaveGameFile } from "./gameProgress";
 
 export class LevelSelectScene extends Phaser.Scene {

    sceneController: SceneController;
    menu: Menu;
    gameProgress: GameProgress;
    saveGameFiles: Array<SaveGameFile>;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;
    deleteAllSaveFilesKey: Phaser.Input.Keyboard.Key;

    constructor(sceneController: SceneController) {
        super({
            key: "LevelSelectScene"
        });
        this.sceneController = sceneController;

        this.gameProgress = new GameProgress();

    }

    init(data): void {
        console.log(data.id);
    }
        
    preload(): void {

    }

    create(): void {

        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.deleteAllSaveFilesKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.saveGameFiles = this.gameProgress.loadAllSaveFiles();

        this.menu = new Menu(this);

        this.menu.setTitle(this, "Continue Game");
        this.menu.setMarker(this, ">>");

        this.saveGameFiles.forEach(element => {
            var item = <SaveGameFile>element;

            var date = new Date(item.modifiedDateTime).toLocaleDateString("en-US");
            this.menu.addMenuItem(this, item.name + ' (' + date + ')');
        });

        if(this.saveGameFiles.length == 0)
            this.menu.addMenuItem(this, "No Saved Games Found");

        this.menu.addMenuItem(this, "Exit to Title");        
    }

    resetMarker(): void {
        if(this.menu != null) {
            this.menu.refreshColorsAndMarker();
            this.menu.marker.visible = false;
        }
    }

    loadSelectedSaveGameFile(): SaveGameFile {
        return this.saveGameFiles[this.menu.selectedIndex];
    }

    update(): void {
        if(Phaser.Input.Keyboard.JustDown(this.selectKey))  {
            /*
            if(this.menu.selectedIndex == 0) {
                this.input.keyboard.resetKeys();
                this.sceneController.preloadGameAndDisplayLoadingScene(0);                
                this.menu.refreshColorsAndMarker();
            }
            if(this.menu.selectedIndex == 1) {
                this.input.keyboard.resetKeys();

                this.sceneController.preloadGameAndDisplayLoadingScene(1);
                this.menu.refreshColorsAndMarker();   
            }*/
            if(this.menu.selectedIndex == this.menu.items.length - 1) {
                this.input.keyboard.resetKeys();
                this.sceneController.returnToTitleSceneFromLevelSelect();
                this.menu.refreshColorsAndMarker();
            }
            else {
                if(this.saveGameFiles.length > 0) {
                    var selectedFile = this.loadSelectedSaveGameFile();

                    this.sceneController.preloadSavedGameAndDisplayLoadingScene(selectedFile.destinationName);
                    this.menu.refreshColorsAndMarker();
                }
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.deleteAllSaveFilesKey)) {
            this.gameProgress.deleteAll();

            this.input.keyboard.resetKeys();
            this.sceneController.returnToTitleSceneFromLevelSelect();
            this.menu.refreshColorsAndMarker();
        }
    }
}