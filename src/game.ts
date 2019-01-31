/**
 * @author       Mark Dickinson
 * @copyright    2019
 * @license      none
 */

/// <reference path="phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";

// main game configuration
const config: GameConfig = {
  width: 3840,
  height: 2160,
  type: Phaser.AUTO,
  parent: "game",
  input: { keyboard: true},
  scene: MainScene,
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
