"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulletOnServer {
    constructor(x, y, playerId, flipX, damage, velocityX) {
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.flipX = flipX;
        this.damage = damage;
        this.velocityX = velocityX;
    }
}
exports.BulletOnServer = BulletOnServer;
