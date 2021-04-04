/**
 * @author       Mark Dickinson
 * @copyright    2021
 * @license      none
 */

/// <reference path="../../node_modules/phaser/types/phaser.d.ts"/>

import "phaser";
import { SceneController } from "./scenes/sceneController";

// main game configuration
var config: Phaser.Types.Core.GameConfig = {
  width: 1920,
  height: 1080,
  type: Phaser.AUTO,
  parent: "game",  
  input: { keyboard: true, gamepad: true},
  scene: [ SceneController],
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
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});
