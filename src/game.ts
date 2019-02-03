/**
 * @author       Mark Dickinson
 * @copyright    2019
 * @license      none
 */

/// <reference path="phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";
import { HudScene } from "./scenes/hudScene";

// main game configuration
const config: GameConfig = {
  width: 1920,
  height: 1080,
  type: Phaser.AUTO,
  parent: "game",
  input: { keyboard: true},
  scene: [ MainScene, HudScene ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});
