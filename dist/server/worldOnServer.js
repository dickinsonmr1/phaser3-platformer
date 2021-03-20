"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorldOnServer {
    // spaceships
    // effects
    // animations
    constructor() {
        this.players = new Array();
        this.enemies = new Array();
        this.bullets = new Array();
    }
    movePlayer() {
        console.log("WorldOnServer.movePlayer()");
    }
    removeTile() {
        console.log("WorldOnServer.removeTile()");
    }
}
exports.WorldOnServer = WorldOnServer;
