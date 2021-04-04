
// https://github.com/yandeu/phaser3-multiplayer-with-physics
// https://github.com/geckosio/phaser3-multiplayer-game-example
// https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/

/**
 * @author       Mark Dickinson
 * @copyright    2021
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>


 import "phaser";
 
 var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 1080,
    type: Phaser.AUTO,
    parent: "game",  
    input: { keyboard: true, gamepad: true},
    audio: {
      //noAudio: true
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 500 },
        debug: true,
        debugShowBody: true,
        debugShowStaticBody: true,
        debugShowVelocity: true,
        debugVelocityColor: 0xffff00,
        debugBodyColor: 0x0000ff,
        debugStaticBodyColor: 0xffffff
      }
    }
  };

  
 // game class
 export class GameServer extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }

    preload() {

    }

    create() {

    }

    removeTile() {
        console.log("GameServer.removeTile()");
    }    
        
    movePlayer() {
        console.log("GameServer.movePlayer()");
    }
}