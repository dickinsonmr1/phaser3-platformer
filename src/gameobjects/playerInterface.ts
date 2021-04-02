import { Socket } from "socket.io-client";
import { Constants } from "../client/constants";
import { MainScene } from "../client/scenes/mainScene";
import { Player } from "./player";

export class PlayerInterface {
    public player: Player;
    public socket: Socket

    constructor(params) {
        this.player = params.player;
        this.socket = params.socket;
    }

    public init() : void{

    }
    moveX(multiplier: number): void {
        this.player.moveX(multiplier);  
        // socket.emit new player x      
    }

    duck(): void {
        this.player.duck();
    }

    stand(): void {
    }

    tryJump(sound): void {
        this.player.tryJump(sound);
    }

    tryInteract(): void {
        if(!this.player.isInSpaceship) {
            this.player.tryInteract();
        }
        else {
            this.player.tryExitSpaceship(this.player.currentSpaceship);
        }   
    }

    collectWeapon() {
        
    }

    addGamepadListeners(scene: MainScene) {
        if (scene.input.gamepad.total === 0)
        {
            scene.input.gamepad.once('connected', pad => {
        
            //if(this.input.gamepad.pad1 != null) {
                //this.gamepad = this.input.gamepad.pad1;

                scene.gamepad = pad;
                pad.on('down', (index, value, button) => {

                    switch(index) {
                        case Constants.gamepadIndexJump:
                            console.log('A');
                            this.tryJump(scene.sound);
                            break;
                        case Constants.gamepadIndexInteract:
                            console.log('X');
                            this.tryInteract();
                            break;
                        case Constants.gamepadIndexPause:
                            scene.sceneController.pauseGame();
                            break;
                        case Constants.gamepadIndexUp:
                            console.log('Up');
                            this.tryJump(scene.sound);
                            break;
                        case Constants.gamepadIndexDown:
                            console.log('Down');
                            this.duck();
                            break;
                        case Constants.gamepadIndexLeft:
                            console.log('Left');
                            this.moveX(-1);
                            break;
                        case Constants.gamepadIndexRight:
                            console.log('Right');
                            this.moveX(1);
                            break;                    
                        //case Constants.gamepadIndexShoot:
                            //console.log('B');
                            //this.player.tryFireBullet(this.sys.game.loop.time, this.sound);
                    }
                });
            });
        }     
    }

    processInput(scene: MainScene){
        const pad = scene.gamepad;
        const threshold = 0.25;
        if (pad != null && pad.axes.length)
        {
            var leftAxisX = pad.axes[0].getValue();
            var leftAxisY = pad.axes[1].getValue();

            if(!this.player.isInSpaceship) {
                if(leftAxisX != 0)
                    this.player.moveX(leftAxisX);
                else if (leftAxisY > 0) {
                    this.player.duck();
                }        
                else {
                    this.player.stand();
                }
            }
            else {

                if(leftAxisX != 0 || leftAxisY != 0) {
                    this.player.tryMoveSpaceship(leftAxisX, leftAxisY);                    
                }
                else {
                    this.player.tryStopSpaceShipX();
                    this.player.tryStopSpaceShipY();
                }                    
            }

            if(pad.B || pad.R2) {
                this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            }
        }

        if (pad == null) {

            // keyboard
            if(!this.player.isInSpaceship) {

                if(Phaser.Input.Keyboard.JustDown(scene.interactKey)) {
                    this.player.tryInteract();
                }

                if (scene.cursors.left.isDown) {
                    this.player.moveX(-1);
                }
                else if (scene.cursors.right.isDown) {
                    this.player.moveX(1);
                }
                else if (scene.cursors.down.isDown) {
                    this.player.duck();
                }        
                else {
                    this.player.stand();
                }
                    
                if ((scene.jumpKey.isDown || scene.cursors.up.isDown))
                {
                    this.player.tryJump(scene.sound);
                }     
            }
            else {
                if (scene.cursors.left.isDown) {
                    this.player.tryMoveSpaceship(-1, 0);
                }
                else if (scene.cursors.right.isDown) {
                    this.player.tryMoveSpaceship(1, 0);
                }
                else {
                    this.player.tryStopSpaceShipX();
                }

                if (scene.cursors.down.isDown) {
                    this.player.tryMoveDown();
                }        
                else if (scene.cursors.up.isDown)
                {
                    this.player.tryMoveUp();
                }     
                else {
                    this.player.tryStopSpaceShipY();
                }           
                
                if(scene.jumpKey.isDown || scene.shootKey2.isDown || Phaser.Input.Keyboard.JustDown(scene.interactKey)) {
                    this.player.tryExitSpaceship(scene.playerSpaceShip);
                }    
            }

            if(scene.shootKey.isDown) {
                this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            }
        }
    }
}