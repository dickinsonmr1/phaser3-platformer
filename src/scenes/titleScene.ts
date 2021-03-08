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
import { Constants } from "../constants";
import { PlayerOnServer } from "../../server/server";
 
export class TitleScene extends Phaser.Scene {

    sceneController: SceneController;
    menus: Array<Menu>;
    menuSelectedIndex: number;
    
    gameProgress: GameProgress;
    saveGameFiles: Array<SaveGameFile>;

    pauseKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;
    cursorLeft: Phaser.Input.Keyboard.Key;
    cursorRight: Phaser.Input.Keyboard.Key;
    deleteAllSaveFilesKey: Phaser.Input.Keyboard.Key;

    gamepadUp: Phaser.Input.Gamepad.Button;
    gamepadDown: Phaser.Input.Gamepad.Button;
    gamepadSelect: Phaser.Input.Gamepad.Button;
    gamepad: Phaser.Input.Gamepad.Gamepad;

    currentLeftAxisX: number;
    currentLeftAxisY: number;
    
    public static get menuScreenIndexTitle(): number { return 0; }
    public static get menuScreenIndexContinue(): number { return 1; }
    public static get menuScreenIndexMultiplayer(): number { return 2; }

    public static get menuIndexStartGame(): number { return 0; }
    public static get menuIndexContinue(): number { return 1; }
    public static get menuIndexMultiplayer(): number { return 2; }    
    public static get menuIndexExit(): number { return 3; }
    
    constructor(sceneController: SceneController) {
        super({
            key: "TitleScene"
        });
        
        
        this.gamepad = null;
        this.sceneController = sceneController;
        this.gameProgress = new GameProgress();
    }
        
    init(data): void {
        console.log(data.id);        
    }

    preload(): void {        

        this.load.atlasXML('sprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');
        //this.load.atlasXML('sprites', './assets/sprites/player/spritesheet_players.png', './assets/sprites/player/spritesheet_players.xml');

        this.load.audio('menuSelectSound', '/assets/audio/confirmation_002.ogg');      
        this.load.audio('menuSwitchItemSound', '/assets/audio/drop_003.ogg');    
        this.load.audio('selectSound', '/assets/audio/maximize_006.ogg');     
        this.load.audio('backSound', '/assets/audio/minimize_006.ogg');  
        this.load.audio('pauseSound', '/assets/audio/maximize_006.ogg');     
        this.load.audio('resumeSound', '/assets/audio/minimize_006.ogg');         
    }    

    create(): void {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.cursorLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.cursorRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.deleteAllSaveFilesKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        //this.addGamepadListeners();

        this.saveGameFiles = this.gameProgress.loadAllSaveFiles();

        this.menus = new Array<Menu>();
        var titleMenu = new Menu(this);
        var continueMenu = new Menu(this);
        var multiplayerMenu = new Menu(this);

        titleMenu.setTitle(this, "Alien Commando");
        titleMenu.setTitleIcon(this, 'sprites', 'hudPlayer_blue.png', 1);
        //menu.setTitleIcon(this, 'sprites', 'alienBlue_front.png', 1);
        titleMenu.setMarker(this, ">>");
        titleMenu.addMenuItem(this, "Start Game");        
        titleMenu.addMenuLinkItem(this, "Continue Game", continueMenu);
        titleMenu.addMenuLinkItem(this, "Multiplayer", multiplayerMenu);
        titleMenu.addMenuItem(this, "Exit");
        titleMenu.setFooter(this, "©2021 by Mark Dickinson " );
        titleMenu.setFooter2(this, "Powered by Phaser 3  //  Assets by Kenney.nl");
        //menu.setFooter2(this, "Powered by Phaser 3  //  Assets by Kenney.nl // Additional SFX from zapsplat.com" );
        
        this.menus.push(titleMenu);

        // continue screen
        continueMenu.setTitle(this, "Continue Game");
        continueMenu.setMarker(this, ">>");

        this.saveGameFiles.forEach(element => {
            var item = <SaveGameFile>element;

            var date = new Date(item.modifiedDateTime).toLocaleDateString("en-US");
            continueMenu.addMenuItem(this, item.name + ' (' + date + ')');
        });

        if(this.saveGameFiles.length == 0)
        continueMenu.addMenuItem(this, "No Saved Games Found");

        continueMenu.addMenuLinkItem(this, "Exit to Title", titleMenu);   
        this.menus.push(continueMenu);
        continueMenu.hide();

        // multiplayer screen
        multiplayerMenu.setTitle(this, "Multiplayer Lobby");
        multiplayerMenu.setMarker(this, ">>");
        multiplayerMenu.addMenuComplexItem(this, 'Level', ['Grass', 'Forest', 'Moon', 'Castle']);        
        multiplayerMenu.addMenuComplexItem(this, 'Weapons', ['All', 'Rockets']);     
        
        this.sceneController.socketClient.players.forEach(element => {
            var item = <PlayerOnServer>element;

            var myPlayerId = this.sceneController.socketClient.getMyPlayer().playerId;
            
            if(item.playerId == myPlayerId)
                multiplayerMenu.addMenuComplexItem(this, item.playerId + ' (me)', ['Blue', 'Pink', 'Yellow', 'Tan']);
            else
            multiplayerMenu.addMenuItem(this, item.playerId);
        });

        //if(this.saveGameFiles.length == 0)
        //menu3.addMenuItem(this, "No Saved Games Found");
        multiplayerMenu.addMenuItem(this, "Refresh Players");   
        multiplayerMenu.addMenuLinkItem(this, "Exit to Title", titleMenu);   
        this.menus.push(multiplayerMenu);
        multiplayerMenu.hide();
        
        this.menuSelectedIndex = 0;

        this.scene.run('MenuBackgroundScene');
        this.scene.sendToBack('MenuBackgroundScene');              
    }

    resetMarker(): void {
        if(this.menus[this.menuSelectedIndex] != null) {
            this.menus[this.menuSelectedIndex].refreshColorsAndMarker();
            this.menus[this.menuSelectedIndex].marker.visible = false;
        }
    }

    addGamepadListeners() {
        this.input.gamepad.once('connected', pad => {

            this.gamepad = pad;

            pad.on('down', (index, value, button) => {

                switch(index) {
                    case Constants.gamepadIndexSelect:
                        console.log('A');
                        this.selectMenuOption();
                        break;
                    case Constants.gamepadIndexInteract:
                        console.log('X');
                        break;
                    case Constants.gamepadIndexUp:
                        console.log('Up');
                        this.previousMenuOption();
                        break;
                    case Constants.gamepadIndexDown:
                        console.log('Down');
                        this.nextMenuOption();
                        break;
                    case Constants.gamepadIndexLeft:
                        this.previousMenuSubOption();
                        console.log('Left');
                        break;
                    case Constants.gamepadIndexRight:
                        console.log('Right');
                        this.nextMenuSubOption();
                        break;
                }                
            });
        });
    }

    update(): void {
        const pad = this.gamepad;

        const threshold = 0.25;
        if (pad != null && pad.axes.length)
        {
            var leftAxisX = pad.axes[0].getValue();
            var leftAxisY = pad.axes[1].getValue();
    
            if(leftAxisX != 0)
                console.log('Left Stick X: ' + leftAxisX);
            if(leftAxisY != 0)
                console.log('Left Stick Y: ' + leftAxisY);
            if(leftAxisY < -1 * threshold && this.currentLeftAxisY > -1 * threshold)            
                this.previousMenuOption();
            else if(leftAxisY > 0.25 && this.currentLeftAxisY < threshold)
                this.nextMenuOption();
            if(leftAxisX < -1 * threshold && this.currentLeftAxisX > -1 * threshold)
                this.previousMenuSubOption();
            else if(leftAxisX > 0.25 && this.currentLeftAxisX < threshold)
                this.nextMenuSubOption();

            var rightAxisX = pad.axes[2].getValue();
            var rightAxisY = pad.axes[3].getValue();
    
            if(rightAxisX != 0)
                console.log('Right Stick X: ' + rightAxisX);
            if(rightAxisY != 0)
                console.log('Right Stick Y: ' + rightAxisY);

            this.currentLeftAxisX = leftAxisX;
            this.currentLeftAxisY = leftAxisY;
        }

        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {
           this.selectMenuOption();
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.previousMenuOption();
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.nextMenuOption();
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {  
            this.previousMenuSubOption();          
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.nextMenuSubOption();
        }
        else if(Phaser.Input.Keyboard.JustDown(this.deleteAllSaveFilesKey)) {
            this.gameProgress.deleteAll();          
        }
    }

    selectMenuOption() {
        // TODO: refactor
        var selectedMenu = this.menus[this.menuSelectedIndex];
        if(this.menuSelectedIndex == TitleScene.menuScreenIndexTitle) {
            
            if(selectedMenu.selectedItemIndex == TitleScene.menuIndexStartGame) {

                this.input.keyboard.resetKeys();
                this.sceneController.preloadMainSceneAndDisplayLoadingScene('world-01-01');
                this.menus[this.menuSelectedIndex].refreshColorsAndMarker();

                this.sound.play("selectSound");
            }
            else if(selectedMenu.selectedItemIndex == TitleScene.menuIndexContinue) {
                this.switchMenuScreen(selectedMenu, TitleScene.menuScreenIndexContinue);                                
            }
            else if(selectedMenu.selectedItemIndex == TitleScene.menuIndexMultiplayer) {
                this.switchMenuScreen(selectedMenu, TitleScene.menuScreenIndexMultiplayer);                                
            }
        }
        else if(this.menuSelectedIndex == TitleScene.menuScreenIndexContinue) {
            // return to title menu
            if(selectedMenu.selectedItemIndex == selectedMenu.items.length - 1) {
                this.returnToTitle(selectedMenu);
            }
            // saved game slots
            else {
                if(this.saveGameFiles.length > 0) {
                    var selectedFile = this.loadSelectedSaveGameFile();

                    this.sceneController.preloadMainSceneAndDisplayLoadingScene(selectedFile.destinationName);
                    selectedMenu.refreshColorsAndMarker();

                    selectedMenu.confirmSelection(this.sound);
                }                                    
            }
        }
        else if(this.menuSelectedIndex == TitleScene.menuScreenIndexMultiplayer) {
            // return to title menu
            if(selectedMenu.selectedItemIndex == selectedMenu.items.length - 1) {

                this.returnToTitle(selectedMenu);                
            }
        }
    }

    nextMenuOption() {
        this.menus[this.menuSelectedIndex].selectNextItem(this.sound);
    }

    previousMenuOption() {
        this.menus[this.menuSelectedIndex].selectPreviousItem(this.sound);
    }
    
    nextMenuSubOption() {
        this.menus[this.menuSelectedIndex].trySelectPreviousSubItem(this.sound);
    }

    previousMenuSubOption() {
        this.menus[this.menuSelectedIndex].trySelectNextSubItem(this.sound);
    }

    switchMenuScreen(currentMenu: Menu, newMenuScreenIndex: number) {
        currentMenu.hide();
        this.menuSelectedIndex = newMenuScreenIndex;

        this.menus[this.menuSelectedIndex].show();
        this.menus[this.menuSelectedIndex].refreshColorsAndMarker();
        
        this.input.keyboard.resetKeys();

        this.sound.play("selectSound");;
    }

    returnToTitle(currentMenu: Menu) {
        currentMenu.hide();
        
        this.menuSelectedIndex = TitleScene.menuScreenIndexTitle;

        this.menus[this.menuSelectedIndex].show();              
        this.input.keyboard.resetKeys();
        this.menus[this.menuSelectedIndex].refreshColorsAndMarker();
        this.sound.play("backSound");
    }

    loadSelectedSaveGameFile(): SaveGameFile {
        return this.saveGameFiles[this.menus[this.menuSelectedIndex].selectedItemIndex];
    }
}